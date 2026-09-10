"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { getWriteClient } from "@/sanity/writeClient";
import { SITE_CONTENT_TAG } from "@/sanity/queries";

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    throw new Error("Not authorized");
  }
}

function refresh(): void {
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath("/admin/content");
  // Homepage is ISR'd (`export const revalidate = 60`) — that full-route
  // cache only clears via revalidatePath or the 60s timer, not fetch tags.
  revalidatePath("/", "page");
}

async function uploadImage(file: File): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  const client = getWriteClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename: file.name });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const MAX_HEADLINE_LINES = 4;
const MAX_CTA_BUTTONS = 3;

function readHeadlineLines(formData: FormData): { _key: string; text: string; emphasis: boolean }[] {
  const lines = [];
  for (let i = 0; i < MAX_HEADLINE_LINES; i++) {
    const text = String(formData.get(`line${i}Text`) ?? "").trim();
    if (!text) continue;
    lines.push({ _key: randomUUID().slice(0, 12), text, emphasis: formData.get(`line${i}Emphasis`) === "on" });
  }
  return lines;
}

function readCtaButtons(formData: FormData): { _key: string; label: string; href: string }[] {
  const buttons = [];
  for (let i = 0; i < MAX_CTA_BUTTONS; i++) {
    const label = String(formData.get(`cta${i}Label`) ?? "").trim();
    const href = String(formData.get(`cta${i}Href`) ?? "").trim();
    if (!label) continue;
    buttons.push({ _key: randomUUID().slice(0, 12), label, href: href || "#" });
  }
  return buttons;
}

export async function saveHero(formData: FormData): Promise<void> {
  await requireAdmin();

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const subhead = String(formData.get("subhead") ?? "").trim();
  const headlineLines = readHeadlineLines(formData);
  const ctaButtons = readCtaButtons(formData);
  const bgFile = formData.get("backgroundImage");

  if (headlineLines.length === 0) throw new Error("At least one headline line is required");

  const patch: Record<string, unknown> = { eyebrow, subhead, headlineLines, ctaButtons };
  if (bgFile instanceof File && bgFile.size > 0) {
    patch.backgroundImage = await uploadImage(bgFile);
  }

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "hero", _type: "hero" });
  await client.patch("hero").set(patch).commit();

  refresh();
}

export async function saveTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!quote || !name) throw new Error("Quote and name are required");

  const client = getWriteClient();
  if (id) {
    await client.patch(id).set({ quote, name }).commit();
  } else {
    const last = await client.fetch<string | null>(`*[_type == "testimonial"] | order(orderRank desc)[0].orderRank`);
    const orderRank = last ? `${last}zzzz` : "zzzz";
    await client.create({ _type: "testimonial", quote, name, orderRank });
  }

  refresh();
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing testimonial id");

  await getWriteClient().delete(id);

  refresh();
}

export async function moveTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id) throw new Error("Missing testimonial id");

  const client = getWriteClient();
  const all = await client.fetch<{ _id: string }[]>(`*[_type == "testimonial"] | order(orderRank asc){ _id }`);
  const idx = all.findIndex((t) => t._id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= all.length) return;

  const reordered = [...all];
  [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];

  // Re-derive orderRank as a simple lexical sequence matching the new order.
  let tx = client.transaction();
  reordered.forEach((doc, i) => {
    tx = tx.patch(doc._id, { set: { orderRank: String(i).padStart(6, "0") } });
  });
  await tx.commit();

  refresh();
}

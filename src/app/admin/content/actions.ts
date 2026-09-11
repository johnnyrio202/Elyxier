"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { getWriteClient } from "@/sanity/writeClient";
import { SITE_CONTENT_TAG } from "@/sanity/queries";
import { updateLiveStatus } from "@/db/liveStatus";

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
const MAX_LIST_ITEMS = 6;
const MAX_PARAGRAPHS = 5;
const MAX_BENEFITS = 3;
const MAX_PHRASES = 10;

function readHeadlineLines(formData: FormData): { _key: string; text: string; emphasis: boolean }[] {
  const lines = [];
  for (let i = 0; i < MAX_HEADLINE_LINES; i++) {
    const text = String(formData.get(`line${i}Text`) ?? "").trim();
    if (!text) continue;
    lines.push({ _key: randomUUID().slice(0, 12), text, emphasis: formData.get(`line${i}Emphasis`) === "on" });
  }
  return lines;
}

// Shared by any {label, href} array field — hero CTA buttons, live-selling
// channels, nav links. Site settings' socialLinks uses the same shape with
// "platform" instead of "label"; saveSiteSettings remaps it after reading.
function readLabelHrefList(formData: FormData, prefix: string, max = MAX_LIST_ITEMS): { _key: string; label: string; href: string }[] {
  const items = [];
  for (let i = 0; i < max; i++) {
    const label = String(formData.get(`${prefix}${i}Label`) ?? "").trim();
    const href = String(formData.get(`${prefix}${i}Href`) ?? "").trim();
    if (!label) continue;
    items.push({ _key: randomUUID().slice(0, 12), label, href: href || "#" });
  }
  return items;
}

function readTextList(formData: FormData, prefix: string, max: number): string[] {
  const items: string[] = [];
  for (let i = 0; i < max; i++) {
    const v = String(formData.get(`${prefix}${i}`) ?? "").trim();
    if (v) items.push(v);
  }
  return items;
}

function readTitleBodyList(formData: FormData, prefix: string, max: number): { _key: string; title: string; body: string }[] {
  const items = [];
  for (let i = 0; i < max; i++) {
    const title = String(formData.get(`${prefix}${i}Title`) ?? "").trim();
    const body = String(formData.get(`${prefix}${i}Body`) ?? "").trim();
    if (!title) continue;
    items.push({ _key: randomUUID().slice(0, 12), title, body });
  }
  return items;
}

export async function saveLiveStatus(formData: FormData): Promise<void> {
  await requireAdmin();

  await updateLiveStatus({
    instagramLive: formData.get("instagramLive") === "on",
    tiktokLive: formData.get("tiktokLive") === "on",
  });

  // Only the homepage badge needs to update — no Sanity content changed,
  // so this skips the SITE_CONTENT_TAG/admin-content revalidation refresh() does.
  revalidatePath("/", "page");
}

export async function saveHero(formData: FormData): Promise<void> {
  await requireAdmin();

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const subhead = String(formData.get("subhead") ?? "").trim();
  const headlineLines = readHeadlineLines(formData);
  const ctaButtons = readLabelHrefList(formData, "cta", MAX_CTA_BUTTONS);
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

export async function saveStory(formData: FormData): Promise<void> {
  await requireAdmin();

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const headlineLines = readHeadlineLines(formData);
  const paragraphs = readTextList(formData, "paragraph", MAX_PARAGRAPHS);
  const pullQuote = String(formData.get("pullQuote") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim();
  const ctaHref = String(formData.get("ctaHref") ?? "").trim();

  if (headlineLines.length === 0) throw new Error("At least one headline line is required");

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "story", _type: "story" });
  await client.patch("story").set({ eyebrow, headlineLines, paragraphs, pullQuote, ctaLabel, ctaHref }).commit();

  refresh();
}

export async function saveCommunity(formData: FormData): Promise<void> {
  await requireAdmin();

  const badge = String(formData.get("badge") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const benefits = readTitleBodyList(formData, "benefit", MAX_BENEFITS);
  const disclaimer = String(formData.get("disclaimer") ?? "").trim();

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "community", _type: "community" });
  await client.patch("community").set({ badge, headline, body, benefits, disclaimer }).commit();

  refresh();
}

export async function saveLiveSelling(formData: FormData): Promise<void> {
  await requireAdmin();

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const headlineLines = readHeadlineLines(formData);
  const body = String(formData.get("body") ?? "").trim();
  const channels = readLabelHrefList(formData, "channel", MAX_LIST_ITEMS);
  const footerLine = String(formData.get("footerLine") ?? "").trim();

  if (headlineLines.length === 0) throw new Error("At least one headline line is required");

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "liveSelling", _type: "liveSelling" });
  await client.patch("liveSelling").set({ eyebrow, headlineLines, body, channels, footerLine }).commit();

  refresh();
}

export async function saveMarquee(formData: FormData): Promise<void> {
  await requireAdmin();

  const phrases = readTextList(formData, "phrase", MAX_PHRASES);
  if (phrases.length === 0) throw new Error("At least one phrase is required");

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "marquee", _type: "marquee" });
  await client.patch("marquee").set({ phrases }).commit();

  refresh();
}

export async function saveSiteSettings(formData: FormData): Promise<void> {
  await requireAdmin();

  const navLinks = readLabelHrefList(formData, "nav", MAX_LIST_ITEMS);
  const footerTagline = String(formData.get("footerTagline") ?? "").trim();
  const footerNote = String(formData.get("footerNote") ?? "").trim();
  const copyrightText = String(formData.get("copyrightText") ?? "").trim();
  const socialLinks = readLabelHrefList(formData, "social", MAX_LIST_ITEMS).map(({ _key, label, href }) => ({
    _key,
    platform: label,
    href,
  }));
  const logoFile = formData.get("logo");
  const productsEyebrow = String(formData.get("productsEyebrow") ?? "").trim();
  const productsHeading = String(formData.get("productsHeading") ?? "").trim();
  const productCardBackLabel = String(formData.get("productCardBackLabel") ?? "").trim();
  const testimonialsEyebrow = String(formData.get("testimonialsEyebrow") ?? "").trim();
  const testimonialsHeading = String(formData.get("testimonialsHeading") ?? "").trim();

  const patch: Record<string, unknown> = {
    navLinks,
    footerTagline,
    footerNote,
    copyrightText,
    socialLinks,
    productsEyebrow,
    productsHeading,
    productCardBackLabel,
    testimonialsEyebrow,
    testimonialsHeading,
  };
  if (logoFile instanceof File && logoFile.size > 0) {
    patch.logo = await uploadImage(logoFile);
  }

  const client = getWriteClient();
  await client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" });
  await client.patch("siteSettings").set(patch).commit();

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

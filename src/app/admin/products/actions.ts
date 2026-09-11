"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { upsertProduct, setBundleItems, type Discount, type BundleItem } from "@/db/products";
import { PRODUCTS_TAG } from "@/sanity/queries";
import { getWriteClient } from "@/sanity/writeClient";
import { slugify } from "@/lib/slugify";

const MAX_BUNDLE_COMPONENTS = 8;

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    throw new Error("Not authorized");
  }
}

function refreshCatalog(): void {
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  revalidatePath("/admin/products");
  // The homepage is ISR'd (`export const revalidate = 60` in page.tsx), which
  // caches the full rendered route independently of any fetch tag — tag
  // revalidation alone won't refresh it. Only revalidatePath or the 60s timer
  // clears that cache, and an admin save should feel instant, not eventual.
  revalidatePath("/", "page");
}

async function uploadPhotos(files: File[]): Promise<{ _type: "image"; _key: string; asset: { _type: "reference"; _ref: string } }[]> {
  const client = getWriteClient();
  const uploaded = [];
  for (const file of files) {
    if (file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename: file.name });
    uploaded.push({
      _type: "image" as const,
      _key: randomUUID().slice(0, 12),
      asset: { _type: "reference" as const, _ref: asset._id },
    });
  }
  return uploaded;
}

async function nextOrderRank(): Promise<string> {
  const client = getWriteClient();
  const last = await client.fetch<string | null>(`*[_type == "product"] | order(orderRank desc)[0].orderRank`);
  // orderRank values are opaque lexicographically-sortable strings (LexoRank).
  // Appending "zzzz" after the current last value sorts after it without
  // needing the actual LexoRank algorithm for what's just an append.
  return last ? `${last}zzzz` : "zzzz";
}

// A blank discount type means "no discount" — every other combination
// requires a positive value. Dates come from <input type="datetime-local">,
// which is timezone-naive; new Date(...) interprets it in the server's local
// time, same as the browser displaying it back — consistent, if not UTC-exact.
function readDiscount(formData: FormData): Discount | null {
  const type = String(formData.get("discountType") ?? "");
  if (type !== "percent" && type !== "fixed") return null;

  const rawValue = String(formData.get("discountValue") ?? "").trim();
  const value = type === "percent" ? Number(rawValue) : Math.round(Number(rawValue) * 100);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Discount value must be a positive number");
  if (type === "percent" && value > 100) throw new Error("Percent discount can't exceed 100");

  const startsAtRaw = String(formData.get("discountStartsAt") ?? "").trim();
  const endsAtRaw = String(formData.get("discountEndsAt") ?? "").trim();

  return {
    type,
    value,
    startsAt: startsAtRaw ? new Date(startsAtRaw).toISOString() : null,
    endsAt: endsAtRaw ? new Date(endsAtRaw).toISOString() : null,
  };
}

function readBundleItems(formData: FormData): BundleItem[] {
  const items: BundleItem[] = [];
  for (let i = 0; i < MAX_BUNDLE_COMPONENTS; i++) {
    const slug = String(formData.get(`component${i}Slug`) ?? "").trim();
    const quantity = Number(formData.get(`component${i}Qty`) ?? "");
    if (!slug || !Number.isFinite(quantity) || quantity <= 0) continue;
    items.push({ slug, quantity: Math.round(quantity) });
  }
  return items;
}

export async function saveCommerceProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const inventoryCount = Number(formData.get("inventory"));
  const active = formData.get("active") === "on";
  const isBundle = formData.get("isBundle") === "on";
  const discount = readDiscount(formData);

  if (!slug) throw new Error("Missing slug");
  if (!Number.isFinite(priceDollars) || priceDollars < 0) throw new Error("Invalid price");
  if (!Number.isFinite(inventoryCount) || inventoryCount < 0) throw new Error("Invalid inventory");

  await upsertProduct({
    slug,
    priceCents: Math.round(priceDollars * 100),
    // Bundles compute their own inventory from components — this value is
    // ignored for them (upsertProduct still writes it, harmlessly unused).
    inventoryCount: Math.round(inventoryCount),
    active,
    isBundle,
    discount,
  });

  if (isBundle) {
    await setBundleItems(slug, readBundleItems(formData));
  }

  refreshCatalog();
}

export async function createProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const shortDesc = String(formData.get("shortDesc") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const inventoryCount = Number(formData.get("inventory"));
  const active = formData.get("active") === "on";
  const isBundle = formData.get("isBundle") === "on";
  const discount = readDiscount(formData);
  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!name) throw new Error("Missing product name");
  if (!Number.isFinite(priceDollars) || priceDollars < 0) throw new Error("Invalid price");
  if (!Number.isFinite(inventoryCount) || inventoryCount < 0) throw new Error("Invalid inventory");

  const bundleItems = isBundle ? readBundleItems(formData) : [];
  if (isBundle && bundleItems.length === 0) throw new Error("A bundle needs at least one component product");

  const client = getWriteClient();

  const baseSlug = slugify(name) || "product";
  const existingSlugs = new Set(
    (await client.fetch<string[]>(`*[_type == "product"].slug.current`)) ?? []
  );
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  const photos = await uploadPhotos(photoFiles);
  const orderRank = await nextOrderRank();

  await client.create({
    _type: "product",
    name,
    slug: { _type: "slug", current: slug },
    shortDesc,
    blurb,
    photos,
    orderRank,
  });

  await upsertProduct({
    slug,
    priceCents: Math.round(priceDollars * 100),
    inventoryCount: Math.round(inventoryCount),
    active,
    isBundle,
    discount,
  });

  if (isBundle) {
    await setBundleItems(slug, bundleItems);
  }

  refreshCatalog();
}

export async function updateProductContent(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const shortDesc = String(formData.get("shortDesc") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();

  if (!id) throw new Error("Missing product id");
  if (!name) throw new Error("Missing product name");

  await getWriteClient().patch(id).set({ name, shortDesc, blurb }).commit();

  refreshCatalog();
}

export async function addProductPhotos(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (!id) throw new Error("Missing product id");
  if (photoFiles.length === 0) return;

  const newPhotos = await uploadPhotos(photoFiles);
  await getWriteClient()
    .patch(id)
    .setIfMissing({ photos: [] })
    .append("photos", newPhotos)
    .commit();

  refreshCatalog();
}

export async function removeProductPhoto(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const key = String(formData.get("photoKey") ?? "");
  if (!id || !key) throw new Error("Missing product id or photo key");

  await getWriteClient().patch(id).unset([`photos[_key=="${key}"]`]).commit();

  refreshCatalog();
}

export async function moveProductPhoto(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const key = String(formData.get("photoKey") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !key) throw new Error("Missing product id or photo key");

  const client = getWriteClient();
  const photos = await client.fetch<{ _key: string }[]>(`*[_id == $id][0].photos`, { id });
  if (!photos) return;

  const idx = photos.findIndex((p) => p._key === key);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= photos.length) return;

  const reordered = [...photos];
  [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];

  await client.patch(id).set({ photos: reordered }).commit();

  refreshCatalog();
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

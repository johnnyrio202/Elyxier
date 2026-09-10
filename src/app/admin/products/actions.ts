"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { upsertProduct } from "@/db/products";
import { PRODUCTS_TAG } from "@/sanity/queries";

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    throw new Error("Not authorized");
  }
}

export async function saveCommerceProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const inventoryCount = Number(formData.get("inventory"));
  const active = formData.get("active") === "on";

  if (!slug) throw new Error("Missing slug");
  if (!Number.isFinite(priceDollars) || priceDollars < 0) throw new Error("Invalid price");
  if (!Number.isFinite(inventoryCount) || inventoryCount < 0) throw new Error("Invalid inventory");

  await upsertProduct({
    slug,
    priceCents: Math.round(priceDollars * 100),
    inventoryCount: Math.round(inventoryCount),
    active,
  });

  // Same tag the Sanity publish webhook revalidates, so the storefront
  // reflects commerce edits immediately instead of waiting for the next ISR window.
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  revalidatePath("/admin/products");
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

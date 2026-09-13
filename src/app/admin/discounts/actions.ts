"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { createDiscountCode, setDiscountCodeActive, deleteDiscountCode } from "@/db/discounts";

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    throw new Error("Not authorized");
  }
}

function refresh(): void {
  revalidatePath("/admin/discounts");
}

export async function createDiscount(formData: FormData): Promise<void> {
  await requireAdmin();

  const code = String(formData.get("code") ?? "").trim();
  const type = String(formData.get("type") ?? "") as "percent" | "fixed";
  const rawValue = String(formData.get("value") ?? "").trim();
  const rawMaxUses = String(formData.get("maxUses") ?? "").trim();
  const rawExpiresAt = String(formData.get("expiresAt") ?? "").trim();

  if (!code) throw new Error("Code is required");
  if (type !== "percent" && type !== "fixed") throw new Error("Invalid discount type");

  const value = type === "percent" ? Number(rawValue) : Math.round(Number(rawValue) * 100);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Invalid discount value");
  if (type === "percent" && value > 100) throw new Error("Percent discount can't exceed 100");

  const maxUses = rawMaxUses ? Number(rawMaxUses) : null;
  if (maxUses != null && (!Number.isInteger(maxUses) || maxUses <= 0)) throw new Error("Invalid max uses");

  const expiresAt = rawExpiresAt ? new Date(rawExpiresAt).toISOString() : null;

  await createDiscountCode({ code, type, value, maxUses, expiresAt });
  refresh();
}

export async function toggleDiscountActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  await setDiscountCodeActive(id, active);
  refresh();
}

export async function removeDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await deleteDiscountCode(id);
  refresh();
}

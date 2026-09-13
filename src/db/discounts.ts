import "server-only";
import { getSql } from "./client";

export type DiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
};

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

// Mirrors applyDiscount's percent/fixed math in src/db/products.ts, but off
// a cart subtotal rather than a single product's price.
export function computeDiscountCents(subtotalCents: number, discount: { type: "percent" | "fixed"; value: number }): number {
  const cents = discount.type === "percent" ? Math.round(subtotalCents * (discount.value / 100)) : discount.value;
  return Math.min(subtotalCents, Math.max(0, cents));
}

function mapRow(row: Record<string, unknown>): DiscountCode {
  return {
    id: row.id as string,
    code: row.code as string,
    type: row.discount_type as "percent" | "fixed",
    value: Number(row.discount_value),
    active: row.active as boolean,
    maxUses: row.max_uses != null ? Number(row.max_uses) : null,
    usedCount: Number(row.used_count),
    expiresAt: (row.expires_at as Date | null)?.toISOString() ?? null,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

// Active, unexpired, and under its usage cap — everything a checkout is
// allowed to redeem right now.
export async function getRedeemableDiscount(code: string): Promise<DiscountCode | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM discount_codes
    WHERE code = ${normalizeCode(code)}
      AND active
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses IS NULL OR used_count < max_uses)
  `) as Record<string, unknown>[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function listDiscountCodes(): Promise<DiscountCode[]> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM discount_codes ORDER BY created_at DESC`) as Record<string, unknown>[];
  return rows.map(mapRow);
}

export async function createDiscountCode(input: {
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxUses: number | null;
  expiresAt: string | null;
}): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO discount_codes (code, discount_type, discount_value, max_uses, expires_at)
    VALUES (${normalizeCode(input.code)}, ${input.type}, ${input.value}, ${input.maxUses}, ${input.expiresAt})
  `;
}

export async function setDiscountCodeActive(id: string, active: boolean): Promise<void> {
  const sql = getSql();
  await sql`UPDATE discount_codes SET active = ${active} WHERE id = ${id}`;
}

export async function deleteDiscountCode(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM discount_codes WHERE id = ${id}`;
}

export async function incrementDiscountUsage(code: string): Promise<void> {
  const sql = getSql();
  await sql`UPDATE discount_codes SET used_count = used_count + 1 WHERE code = ${normalizeCode(code)}`;
}

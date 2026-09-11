import "server-only";
import { getSql } from "./client";
import { computeShippingCents, type ShippingSettings } from "@/lib/shippingCalc";

export type { ShippingSettings };
export { computeShippingCents };

export async function getShippingSettings(): Promise<ShippingSettings> {
  const sql = getSql();
  const [row] = (await sql`SELECT flat_rate_cents, free_shipping_threshold_cents FROM shipping_settings WHERE id = true`) as Record<
    string,
    unknown
  >[];
  return {
    flatRateCents: row ? Number(row.flat_rate_cents) : 500,
    freeShippingThresholdCents: row?.free_shipping_threshold_cents != null ? Number(row.free_shipping_threshold_cents) : null,
  };
}

export async function updateShippingSettings(input: ShippingSettings): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE shipping_settings
    SET flat_rate_cents = ${input.flatRateCents}, free_shipping_threshold_cents = ${input.freeShippingThresholdCents}
    WHERE id = true
  `;
}

import "server-only";
import { getSql } from "./client";

export type CommerceProduct = {
  slug: string;
  sku: string | null;
  priceCents: number;
  inventoryCount: number;
  active: boolean;
  weightOz: number;
};

function mapRow(row: Record<string, unknown>): CommerceProduct {
  return {
    slug: row.slug as string,
    sku: (row.sku as string | null) ?? null,
    priceCents: Number(row.price_cents),
    inventoryCount: Number(row.inventory_count),
    active: row.active as boolean,
    weightOz: Number(row.weight_oz),
  };
}

export async function listCommerceProducts(): Promise<CommerceProduct[]> {
  const sql = getSql();
  const rows = await sql`SELECT slug, sku, price_cents, inventory_count, active, weight_oz FROM products`;
  return (rows as Record<string, unknown>[]).map(mapRow);
}

export async function getCommerceProduct(slug: string): Promise<CommerceProduct | null> {
  const sql = getSql();
  const rows = await sql`SELECT slug, sku, price_cents, inventory_count, active, weight_oz FROM products WHERE slug = ${slug}`;
  const row = (rows as Record<string, unknown>[])[0];
  return row ? mapRow(row) : null;
}

export async function upsertProduct(input: {
  slug: string;
  priceCents: number;
  inventoryCount: number;
  sku?: string | null;
  active?: boolean;
  weightOz?: number;
}): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO products (slug, sku, price_cents, inventory_count, active, weight_oz)
    VALUES (${input.slug}, ${input.sku ?? null}, ${input.priceCents}, ${input.inventoryCount}, ${input.active ?? true}, ${input.weightOz ?? 6})
    ON CONFLICT (slug) DO UPDATE SET
      sku = EXCLUDED.sku,
      price_cents = EXCLUDED.price_cents,
      active = EXCLUDED.active,
      updated_at = now()
  `;
}

// Best-effort decrement after a successful payment. Floors at zero rather than
// blocking on stock — at this boutique's order volume, oversells get caught
// and resolved by hand rather than needing distributed-lock machinery.
export async function decrementInventory(slug: string, quantity: number): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE products
    SET inventory_count = GREATEST(inventory_count - ${quantity}, 0), updated_at = now()
    WHERE slug = ${slug}
  `;
}

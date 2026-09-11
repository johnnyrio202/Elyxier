import "server-only";
import { getSql } from "./client";

export type Discount = {
  type: "percent" | "fixed";
  value: number; // percent: 0-100. fixed: cents off.
  startsAt: string | null;
  endsAt: string | null; // null means the discount runs until stopped or deleted
};

export type BundleItem = { slug: string; quantity: number };

export type CommerceProduct = {
  slug: string;
  sku: string | null;
  priceCents: number; // effective price — discount already applied if active
  originalPriceCents: number | null; // present only while a discount is active
  inventoryCount: number; // for bundles, derived from component stock — see computeBundleInventory
  active: boolean;
  weightOz: number;
  isBundle: boolean;
  discount: Discount | null;
  bundleItems: BundleItem[];
};

function isDiscountActive(discount: Discount | null, now: number): boolean {
  if (!discount) return false;
  if (discount.startsAt && new Date(discount.startsAt).getTime() > now) return false;
  if (discount.endsAt && new Date(discount.endsAt).getTime() < now) return false;
  return true;
}

function applyDiscount(basePriceCents: number, discount: Discount | null): number {
  const now = Date.now();
  if (!isDiscountActive(discount, now)) return basePriceCents;
  const cents =
    discount!.type === "percent"
      ? Math.round(basePriceCents * (1 - discount!.value / 100))
      : basePriceCents - discount!.value;
  return Math.max(0, cents);
}

function readDiscount(row: Record<string, unknown>): Discount | null {
  if (!row.discount_type) return null;
  return {
    type: row.discount_type as "percent" | "fixed",
    value: Number(row.discount_value),
    startsAt: (row.discount_starts_at as string | null) ?? null,
    endsAt: (row.discount_ends_at as string | null) ?? null,
  };
}

// A bundle can only sell as many units as its scarcest component allows,
// scaled by how many of that component each bundle actually uses.
function computeBundleInventory(items: BundleItem[], inventoryBySlug: Map<string, number>): number {
  if (items.length === 0) return 0;
  return Math.min(...items.map((item) => Math.floor((inventoryBySlug.get(item.slug) ?? 0) / item.quantity)));
}

async function fetchBundleItemsBySlug(bundleSlugs: string[]): Promise<Map<string, BundleItem[]>> {
  const map = new Map<string, BundleItem[]>();
  if (bundleSlugs.length === 0) return map;
  const sql = getSql();
  const rows = (await sql`
    SELECT bundle_slug, component_slug, quantity FROM bundle_items WHERE bundle_slug = ANY(${bundleSlugs})
  `) as Record<string, unknown>[];
  for (const row of rows) {
    const bundleSlug = row.bundle_slug as string;
    const item = { slug: row.component_slug as string, quantity: Number(row.quantity) };
    map.set(bundleSlug, [...(map.get(bundleSlug) ?? []), item]);
  }
  return map;
}

function mapRows(rows: Record<string, unknown>[], bundleItemsBySlug: Map<string, BundleItem[]>): CommerceProduct[] {
  const inventoryBySlug = new Map(rows.map((r) => [r.slug as string, Number(r.inventory_count)]));

  return rows.map((row) => {
    const slug = row.slug as string;
    const isBundle = row.is_bundle as boolean;
    const bundleItems = bundleItemsBySlug.get(slug) ?? [];
    const discount = readDiscount(row);
    const basePriceCents = Number(row.price_cents);
    const priceCents = applyDiscount(basePriceCents, discount);

    return {
      slug,
      sku: (row.sku as string | null) ?? null,
      priceCents,
      originalPriceCents: priceCents !== basePriceCents ? basePriceCents : null,
      inventoryCount: isBundle ? computeBundleInventory(bundleItems, inventoryBySlug) : Number(row.inventory_count),
      active: row.active as boolean,
      weightOz: Number(row.weight_oz),
      isBundle,
      discount,
      bundleItems,
    };
  });
}

const PRODUCT_COLUMNS = `
  slug, sku, price_cents, inventory_count, active, weight_oz, is_bundle,
  discount_type, discount_value, discount_starts_at, discount_ends_at
`;

export async function listCommerceProducts(): Promise<CommerceProduct[]> {
  const sql = getSql();
  const rows = (await sql.query(`SELECT ${PRODUCT_COLUMNS} FROM products`)) as Record<string, unknown>[];
  const bundleSlugs = rows.filter((r) => r.is_bundle).map((r) => r.slug as string);
  const bundleItemsBySlug = await fetchBundleItemsBySlug(bundleSlugs);
  return mapRows(rows, bundleItemsBySlug);
}

export async function getCommerceProduct(slug: string): Promise<CommerceProduct | null> {
  const sql = getSql();
  const rows = (await sql.query(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1`, [slug])) as Record<string, unknown>[];
  const row = rows[0];
  if (!row) return null;

  if (!row.is_bundle) {
    return mapRows([row], new Map())[0];
  }

  // A bundle's inventory depends on its components' stock, which isn't in
  // this single-row query — fetch those too, same as listCommerceProducts does.
  const bundleItemsBySlug = await fetchBundleItemsBySlug([slug]);
  const items = bundleItemsBySlug.get(slug) ?? [];
  const componentRows =
    items.length > 0
      ? ((await sql`SELECT slug, inventory_count FROM products WHERE slug = ANY(${items.map((i) => i.slug)})`) as Record<string, unknown>[])
      : [];
  const inventoryBySlug = new Map(componentRows.map((r) => [r.slug as string, Number(r.inventory_count)]));
  const discount = readDiscount(row);
  const basePriceCents = Number(row.price_cents);
  const priceCents = applyDiscount(basePriceCents, discount);

  return {
    slug: row.slug as string,
    sku: (row.sku as string | null) ?? null,
    priceCents,
    originalPriceCents: priceCents !== basePriceCents ? basePriceCents : null,
    inventoryCount: computeBundleInventory(items, inventoryBySlug),
    active: row.active as boolean,
    weightOz: Number(row.weight_oz),
    isBundle: true,
    discount,
    bundleItems: items,
  };
}

export async function upsertProduct(input: {
  slug: string;
  priceCents: number;
  inventoryCount: number;
  sku?: string | null;
  active?: boolean;
  weightOz?: number;
  isBundle?: boolean;
  discount?: Discount | null;
}): Promise<void> {
  const sql = getSql();
  const discount = input.discount ?? null;
  await sql`
    INSERT INTO products (
      slug, sku, price_cents, inventory_count, active, weight_oz, is_bundle,
      discount_type, discount_value, discount_starts_at, discount_ends_at
    )
    VALUES (
      ${input.slug}, ${input.sku ?? null}, ${input.priceCents}, ${input.inventoryCount}, ${input.active ?? true}, ${input.weightOz ?? 6}, ${input.isBundle ?? false},
      ${discount?.type ?? null}, ${discount?.value ?? null}, ${discount?.startsAt ?? null}, ${discount?.endsAt ?? null}
    )
    ON CONFLICT (slug) DO UPDATE SET
      sku = EXCLUDED.sku,
      price_cents = EXCLUDED.price_cents,
      inventory_count = EXCLUDED.inventory_count,
      active = EXCLUDED.active,
      is_bundle = EXCLUDED.is_bundle,
      discount_type = EXCLUDED.discount_type,
      discount_value = EXCLUDED.discount_value,
      discount_starts_at = EXCLUDED.discount_starts_at,
      discount_ends_at = EXCLUDED.discount_ends_at,
      updated_at = now()
  `;
}

// Replaces the full set of components for a bundle. Safe to call with an
// empty list to clear it (the bundle then has zero computed inventory).
export async function setBundleItems(bundleSlug: string, items: BundleItem[]): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM bundle_items WHERE bundle_slug = ${bundleSlug}`;
  for (const item of items) {
    await sql`
      INSERT INTO bundle_items (bundle_slug, component_slug, quantity)
      VALUES (${bundleSlug}, ${item.slug}, ${item.quantity})
    `;
  }
}

// Best-effort decrement after a successful payment. Floors at zero rather than
// blocking on stock — at this boutique's order volume, oversells get caught
// and resolved by hand rather than needing distributed-lock machinery.
// A bundle has no independent stock of its own — selling one decrements each
// of its components instead.
export async function decrementInventory(slug: string, quantity: number): Promise<void> {
  const sql = getSql();
  const items = (await sql`SELECT component_slug, quantity FROM bundle_items WHERE bundle_slug = ${slug}`) as Record<string, unknown>[];

  if (items.length > 0) {
    for (const item of items) {
      const decrementBy = Number(item.quantity) * quantity;
      await sql`
        UPDATE products
        SET inventory_count = GREATEST(inventory_count - ${decrementBy}, 0), updated_at = now()
        WHERE slug = ${item.component_slug as string}
      `;
    }
    return;
  }

  await sql`
    UPDATE products
    SET inventory_count = GREATEST(inventory_count - ${quantity}, 0), updated_at = now()
    WHERE slug = ${slug}
  `;
}

// A quick on/off switch for the collapsed admin row — unlike
// saveCommerceProduct/upsertProduct, this touches only `active` so a fast
// toggle can't accidentally clobber price, inventory, or discount fields
// that aren't present in its (deliberately tiny) form submission.
export async function setProductActive(slug: string, active: boolean): Promise<void> {
  const sql = getSql();
  await sql`UPDATE products SET active = ${active}, updated_at = now() WHERE slug = ${slug}`;
}

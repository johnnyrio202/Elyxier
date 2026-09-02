/**
 * Seeds the commerce database from the products already in Sanity, so the
 * catalog isn't empty on first run. Starting inventory defaults to 50 units —
 * adjust real counts afterward via SQL or a future admin UI.
 *
 * Run with: npx dotenv -e .env.local -- npx tsx scripts/db/seed-commerce.ts
 */
import { neon } from "@neondatabase/serverless";

const DEFAULT_STARTING_INVENTORY = 50;

// Mirrors src/db/products.ts's upsertProduct — duplicated here because that
// module imports "server-only", which throws outside Next's own bundler.
async function upsertProduct(input: { slug: string; priceCents: number; inventoryCount: number }) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  await sql`
    INSERT INTO products (slug, price_cents, inventory_count)
    VALUES (${input.slug}, ${input.priceCents}, ${input.inventoryCount})
    ON CONFLICT (slug) DO UPDATE SET price_cents = EXCLUDED.price_cents, updated_at = now()
  `;
}

async function fetchSanityProducts(): Promise<{ slug: string; price: number }[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");

  const query = `*[_type == "product"]{ "slug": slug.current, price }`;
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { result: { slug: string; price: number }[] };
  return json.result;
}

async function run() {
  const products = await fetchSanityProducts();
  if (!products.length) {
    console.log("No products found in Sanity — nothing to seed.");
    return;
  }

  for (const p of products) {
    await upsertProduct({
      slug: p.slug,
      priceCents: Math.round(p.price * 100),
      inventoryCount: DEFAULT_STARTING_INVENTORY,
    });
    console.log(`Seeded ${p.slug} at $${p.price} / ${DEFAULT_STARTING_INVENTORY} units`);
  }

  console.log(`Seeded ${products.length} products.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

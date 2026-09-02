import "server-only";
import { getProductsContent } from "@/sanity/queries";
import { listCommerceProducts, type CommerceProduct } from "@/db/products";

export type CatalogProduct = {
  slug: string;
  name: string;
  shortDesc: string;
  blurb: string;
  photos: unknown[];
  priceCents: number;
  inventoryCount: number;
  inStock: boolean;
};

// Joins Sanity's editorial content (name/description/photos) with the
// database's commerce fields (price/inventory) by slug. A product only shows
// up here once it exists in both places — content editors and the commerce
// backend both have to agree it's a real, sellable product.
export async function getCatalog(): Promise<CatalogProduct[]> {
  const [content, commerce] = await Promise.all([getProductsContent(), listCommerceProducts()]);
  const commerceBySlug = new Map<string, CommerceProduct>(commerce.map((p) => [p.slug, p]));

  return content
    .map((c) => {
      const p = commerceBySlug.get(c.slug);
      if (!p || !p.active) return null;
      return {
        slug: c.slug,
        name: c.name,
        shortDesc: c.shortDesc,
        blurb: c.blurb,
        photos: c.photos,
        priceCents: p.priceCents,
        inventoryCount: p.inventoryCount,
        inStock: p.inventoryCount > 0,
      };
    })
    .filter((p): p is CatalogProduct => p !== null);
}

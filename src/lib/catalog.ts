import "server-only";
import { getProductsContent } from "@/sanity/queries";
import { listCommerceProducts, type CommerceProduct } from "@/db/products";

export type CatalogProduct = {
  slug: string;
  name: string;
  shortDesc: string;
  blurb: string;
  photos: unknown[];
  priceCents: number; // effective price — discount already applied if active
  originalPriceCents: number | null; // present only while a discount is active, for strikethrough display
  inventoryCount: number;
  inStock: boolean;
  isBundle: boolean;
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
      // Photos are required by the Sanity schema's own validation, but that
      // only blocks publishing in Studio — it doesn't guarantee the published
      // document actually has any, so guard here too rather than let a
      // photo-less product reach the storefront and crash the photo carousel.
      if (!p || !p.active || !c.photos || c.photos.length === 0) return null;
      return {
        slug: c.slug,
        name: c.name,
        shortDesc: c.shortDesc,
        blurb: c.blurb,
        photos: c.photos,
        priceCents: p.priceCents,
        originalPriceCents: p.originalPriceCents,
        inventoryCount: p.inventoryCount,
        inStock: p.inventoryCount > 0,
        isBundle: p.isBundle,
      };
    })
    .filter((p): p is CatalogProduct => p !== null);
}

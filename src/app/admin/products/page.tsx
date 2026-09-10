import { productsQuery, type SanityProductContent } from "@/sanity/queries";
import { getWriteClient } from "@/sanity/writeClient";
import { listCommerceProducts, type CommerceProduct } from "@/db/products";
import { logoutAdmin } from "./actions";
import ProductCard from "./ProductCard";
import NewProductForm from "./NewProductForm";
import AdminNav from "../AdminNav";

const AMBER = "#D4920A";
const BG = "#0A0A08";

export const dynamic = "force-dynamic";

// Reads via the uncached write client (not the CDN-cached getProductsContent
// the storefront uses) — an authoring tool must show its own writes
// immediately, not whatever the CDN has gotten around to invalidating yet.
async function getFreshProductsContent(): Promise<SanityProductContent[]> {
  return getWriteClient().fetch(productsQuery);
}

export default async function AdminProductsPage() {
  const [content, commerce] = await Promise.all([getFreshProductsContent(), listCommerceProducts()]);
  const commerceBySlug = new Map<string, CommerceProduct>(commerce.map((p) => [p.slug, p]));

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Products</h1>
            <p style={{ color: "#9A8A70", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Create products, edit their name, description, and photos, and set price, inventory, and
              whether they&apos;re for sale — all from here. A product only appears on the live site once
              it has a photo and is marked for sale.
            </p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              style={{ background: "transparent", border: `1px solid ${AMBER}55`, color: "#9A8A70", borderRadius: 4, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}
            >
              Log Out
            </button>
          </form>
        </div>

        <AdminNav active="products" />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <NewProductForm />

          {content.map((c) => {
            const p = commerceBySlug.get(c.slug);
            return (
              <ProductCard
                key={c._id}
                product={{
                  _id: c._id,
                  name: c.name,
                  slug: c.slug,
                  shortDesc: c.shortDesc,
                  blurb: c.blurb,
                  photos: (c.photos ?? []) as { _key: string; asset?: unknown }[],
                  commerce: p ? { priceCents: p.priceCents, inventoryCount: p.inventoryCount, active: p.active } : null,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

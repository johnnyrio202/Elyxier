import { productsQuery, type SanityProductContent } from "@/sanity/queries";
import { getWriteClient } from "@/sanity/writeClient";
import { listCommerceProducts, type CommerceProduct } from "@/db/products";
import { getShippingSettings } from "@/db/shipping";
import { logoutAdmin, saveShippingSettings } from "./actions";
import ProductCard from "./ProductCard";
import NewProductForm from "./NewProductForm";
import AdminNav from "../AdminNav";

const AMBER = "var(--admin-accent)";
const CARD = "var(--admin-card)";
const INPUT_STYLE: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--admin-border-strong)",
  borderRadius: 4,
  color: "var(--admin-ink)",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
const LABEL_STYLE: React.CSSProperties = { display: "block", fontSize: 11, color: "var(--admin-muted)", marginBottom: 4 };
const BTN_STYLE: React.CSSProperties = {
  background: "var(--admin-accent)",
  color: "var(--admin-accent-ink)",
  border: "none",
  borderRadius: 4,
  padding: "10px 20px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export const dynamic = "force-dynamic";

// Reads via the uncached write client (not the CDN-cached getProductsContent
// the storefront uses) — an authoring tool must show its own writes
// immediately, not whatever the CDN has gotten around to invalidating yet.
async function getFreshProductsContent(): Promise<SanityProductContent[]> {
  return getWriteClient().fetch(productsQuery);
}

export default async function AdminProductsPage() {
  const [content, commerce, shipping] = await Promise.all([getFreshProductsContent(), listCommerceProducts(), getShippingSettings()]);
  const commerceBySlug = new Map<string, CommerceProduct>(commerce.map((p) => [p.slug, p]));
  const nameBySlug = new Map(content.map((c) => [c.slug, c.name]));
  const allProducts = commerce
    .filter((p) => !p.isBundle)
    .map((p) => ({ slug: p.slug, name: nameBySlug.get(p.slug) ?? p.slug }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Products</h1>
            <p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Create products, edit their name, description, and photos, and set price, inventory, and
              whether they&apos;re for sale — all from here. A product only appears on the live site once
              it has a photo and is marked for sale.
            </p>
          </div>
          <form action={logoutAdmin} className="print:hidden">
            <button
              type="submit"
              style={{ background: "transparent", border: "1px solid var(--admin-border-strong)", color: "var(--admin-muted)", borderRadius: 4, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}
            >
              Log Out
            </button>
          </form>
        </div>

        <AdminNav active="products" />

        <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Shipping</h2>
          <p style={{ color: "var(--admin-muted)", fontSize: 12, marginBottom: 16 }}>
            A flat fee added to every order at checkout. Optionally waive it above a subtotal threshold.
          </p>
          <form action={saveShippingSettings} style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
              Flat Rate (USD)
              <input type="number" name="flatRate" step="0.01" min="0" defaultValue={(shipping.flatRateCents / 100).toFixed(2)} required style={{ ...INPUT_STYLE, width: 100 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--admin-muted)" }}>
              Free Shipping Over (USD, blank = never free)
              <input
                type="number"
                name="freeShippingThreshold"
                step="0.01"
                min="0"
                defaultValue={shipping.freeShippingThresholdCents != null ? (shipping.freeShippingThresholdCents / 100).toFixed(2) : ""}
                style={{ ...INPUT_STYLE, width: 160 }}
              />
            </label>
            <button type="submit" style={BTN_STYLE}>
              Save Shipping
            </button>
          </form>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <NewProductForm allProducts={allProducts} />

          {content.map((c) => {
            const p = commerceBySlug.get(c.slug);
            return (
              <ProductCard
                key={c._id}
                allProducts={allProducts}
                product={{
                  _id: c._id,
                  name: c.name,
                  slug: c.slug,
                  shortDesc: c.shortDesc,
                  blurb: c.blurb,
                  photos: (c.photos ?? []) as { _key: string; asset?: unknown }[],
                  commerce: p
                    ? {
                        priceCents: p.priceCents,
                        originalPriceCents: p.originalPriceCents,
                        inventoryCount: p.inventoryCount,
                        active: p.active,
                        isBundle: p.isBundle,
                        discount: p.discount,
                        bundleItems: p.bundleItems,
                      }
                    : null,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { getProductsContent } from "@/sanity/queries";
import { listCommerceProducts, type CommerceProduct } from "@/db/products";
import { saveCommerceProduct, logoutAdmin } from "./actions";

const AMBER = "#D4920A";
const BG = "#0A0A08";
const CARD = "#141410";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [content, commerce] = await Promise.all([getProductsContent(), listCommerceProducts()]);
  const commerceBySlug = new Map<string, CommerceProduct>(commerce.map((p) => [p.slug, p]));

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Products &amp; Pricing</h1>
            <p style={{ color: "#9A8A70", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Product name, description, and photos are edited in{" "}
              <a href="/studio" style={{ color: AMBER }}>
                the Sanity Studio
              </a>
              . Price, inventory, and whether a product is for sale are set here.
              A product only appears on the live site once it has both.
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {content.map((c) => {
            const p = commerceBySlug.get(c.slug);
            const hasPhotos = c.photos && c.photos.length > 0;
            const isLive = Boolean(p && p.active && hasPhotos);
            return (
              <form
                key={c._id}
                action={saveCommerceProduct}
                style={{ border: `1px solid ${AMBER}33`, borderRadius: 8, padding: 20, background: CARD, display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}
              >
                <input type="hidden" name="slug" value={c.slug} />
                <div style={{ minWidth: 180, flex: "1 1 180px" }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", color: "#9A8A70", fontSize: 12 }}>/{c.slug}</p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: isLive ? `${AMBER}22` : "#5A1F1F",
                      color: isLive ? AMBER : "#E09090",
                    }}
                  >
                    {isLive ? "Live" : p?.active && !hasPhotos ? "Needs a photo" : p ? "Inactive" : "Not sellable yet"}
                  </span>
                  {!hasPhotos && (
                    <p style={{ margin: "4px 0 0", color: "#E09090", fontSize: 11 }}>
                      Add at least one photo in{" "}
                      <a href="/studio" style={{ color: "#E09090", textDecoration: "underline" }}>
                        the Studio
                      </a>{" "}
                      before this can go live.
                    </p>
                  )}
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Price (USD)
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    defaultValue={p ? (p.priceCents / 100).toFixed(2) : ""}
                    required
                    style={{ width: 90, background: "transparent", border: `1px solid ${AMBER}55`, borderRadius: 4, color: "#FAF7F0", padding: "8px 10px", fontSize: 14 }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#9A8A70" }}>
                  Inventory
                  <input
                    type="number"
                    name="inventory"
                    min="0"
                    step="1"
                    defaultValue={p ? p.inventoryCount : 0}
                    required
                    style={{ width: 90, background: "transparent", border: `1px solid ${AMBER}55`, borderRadius: 4, color: "#FAF7F0", padding: "8px 10px", fontSize: 14 }}
                  />
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9A8A70", paddingBottom: 10 }}>
                  <input type="checkbox" name="active" defaultChecked={p?.active ?? true} />
                  For sale
                </label>

                <button
                  type="submit"
                  style={{ background: AMBER, color: BG, border: "none", borderRadius: 4, padding: "10px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Save
                </button>
              </form>
            );
          })}
        </div>

        {content.length === 0 && (
          <p style={{ color: "#9A8A70" }}>
            No products in Sanity yet. Create one in{" "}
            <a href="/studio" style={{ color: AMBER }}>
              the Studio
            </a>{" "}
            first, then come back here to set its price and inventory.
          </p>
        )}
      </div>
    </div>
  );
}

import { getSalesSummary, getTopProducts, listRecentOrders } from "@/db/reports";
import { logoutAdmin } from "../products/actions";
import AdminNav from "../AdminNav";

const AMBER = "var(--admin-accent)";
const CARD = "var(--admin-card)";

export const dynamic = "force-dynamic";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, padding: "18px 20px" }}>
      <p style={{ color: "var(--admin-muted)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{value}</p>
      {sublabel && <p style={{ color: "var(--admin-muted)", fontSize: 12, margin: "4px 0 0" }}>{sublabel}</p>}
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  paid: "var(--admin-good-fg)",
  pending: "var(--admin-muted)",
  refunded: "#D45A5A",
  failed: "#D45A5A",
};

export default async function AdminReportsPage() {
  const [summary, topProducts, orders] = await Promise.all([getSalesSummary(), getTopProducts(5), listRecentOrders(200)]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Sales Reports</h1>
            <p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Revenue and order data pulled directly from your own database — a home-base view alongside whatever
              PayPal reports separately.
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

        <AdminNav active="reports" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Revenue (30 days)" value={money(summary.last30Days.revenueCents)} sublabel={`${summary.last30Days.orderCount} orders`} />
          <StatCard label="Revenue (all time)" value={money(summary.allTime.revenueCents)} sublabel={`${summary.allTime.orderCount} orders`} />
          <StatCard label="Avg order value" value={money(summary.allTime.avgOrderValueCents)} sublabel="All-time" />
          <StatCard label="Discounts redeemed" value={money(summary.allTime.discountCents)} sublabel="All-time, off paid orders" />
        </div>

        <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Top Products</h2>
          {topProducts.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 13, margin: 0 }}>No paid orders yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topProducts.map((p, i) => (
                <div key={p.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                  <span>
                    <span style={{ color: "var(--admin-muted)", marginRight: 10 }}>{i + 1}.</span>
                    {p.name}
                  </span>
                  <span style={{ color: "var(--admin-muted)" }}>
                    {p.unitsSold} sold · {money(p.revenueCents)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Recent Orders</h2>
          <a
            href="/admin/reports/export"
            style={{
              background: "var(--admin-accent)",
              color: "var(--admin-accent-ink)",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Export CSV
          </a>
        </div>

        <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, overflow: "hidden" }}>
          {orders.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 13, padding: 24, margin: 0 }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Items</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Discount</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Total</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Payment</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid var(--admin-border-soft)" }}>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap", color: "var(--admin-muted)" }}>{formatDate(o.createdAt)}</td>
                      <td style={{ padding: "12px 16px" }}>{o.customerName || o.customerEmail || "Guest"}</td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{o.itemCount}</td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{o.discountCode ? `${o.discountCode} (-${money(o.discountCents)})` : "—"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{money(o.totalCents)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: STATUS_COLOR[o.paymentStatus] ?? "var(--admin-ink)", textTransform: "capitalize" as const }}>{o.paymentStatus}</span>
                        {o.paymentProvider && <span style={{ color: "var(--admin-muted)" }}> · {o.paymentProvider}</span>}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)", textTransform: "capitalize" as const }}>{o.fulfillmentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

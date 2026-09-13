import { listDiscountCodes } from "@/db/discounts";
import { logoutAdmin } from "../products/actions";
import { createDiscount, toggleDiscountActive, removeDiscount } from "./actions";
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

function formatValue(type: string, value: number): string {
  return type === "percent" ? `${value}% off` : `$${(value / 100).toFixed(2)} off`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium" });
}

export default async function AdminDiscountsPage() {
  const discounts = await listDiscountCodes();

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Discount Codes</h1>
            <p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Codes customers can enter in the cart. Deactivate a code instead of deleting it if you just want to
              pause it.
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

        <AdminNav active="discounts" />

        <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>New Code</h2>
          <form action={createDiscount} style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={LABEL_STYLE}>Code</span>
              <input type="text" name="code" required placeholder="LAUNCH10" style={{ ...INPUT_STYLE, width: 160, textTransform: "uppercase" }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={LABEL_STYLE}>Type</span>
              <select name="type" defaultValue="percent" style={{ ...INPUT_STYLE, width: 120 }}>
                <option value="percent">% off</option>
                <option value="fixed">$ off</option>
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={LABEL_STYLE}>Value</span>
              <input type="number" name="value" step="0.01" min="0" required placeholder="10" style={{ ...INPUT_STYLE, width: 100 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={LABEL_STYLE}>Max Uses (blank = unlimited)</span>
              <input type="number" name="maxUses" min="1" style={{ ...INPUT_STYLE, width: 160 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={LABEL_STYLE}>Expires (blank = never)</span>
              <input type="date" name="expiresAt" style={{ ...INPUT_STYLE, width: 160 }} />
            </label>
            <button type="submit" style={BTN_STYLE}>
              Create Code
            </button>
          </form>
        </section>

        <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, overflow: "hidden" }}>
          {discounts.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 13, padding: 24, margin: 0 }}>No discount codes yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Code</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Discount</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Uses</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Expires</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "12px 16px" }} />
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid var(--admin-border-soft)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.code}</td>
                      <td style={{ padding: "12px 16px" }}>{formatValue(d.type, d.value)}</td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>
                        {d.usedCount}
                        {d.maxUses != null ? ` / ${d.maxUses}` : ""}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{d.expiresAt ? formatDate(d.expiresAt) : "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: d.active ? AMBER : "var(--admin-muted)" }}>{d.active ? "Active" : "Inactive"}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <form action={toggleDiscountActive} style={{ display: "inline" }}>
                          <input type="hidden" name="id" value={d.id} />
                          <input type="hidden" name="active" value={(!d.active).toString()} />
                          <button type="submit" style={{ background: "transparent", border: "1px solid var(--admin-border-strong)", color: "var(--admin-ink)", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", marginRight: 8 }}>
                            {d.active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                        <form action={removeDiscount} style={{ display: "inline" }}>
                          <input type="hidden" name="id" value={d.id} />
                          <button type="submit" style={{ background: "transparent", border: "1px solid var(--admin-border-strong)", color: "#D45A5A", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>
                            Delete
                          </button>
                        </form>
                      </td>
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

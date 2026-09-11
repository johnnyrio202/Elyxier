import { listLeads } from "@/db/leads";
import { logoutAdmin } from "../products/actions";
import AdminNav from "../AdminNav";

const AMBER = "var(--admin-accent)";
const CARD = "var(--admin-card)";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Leads</h1>
            <p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              Everyone who&apos;s submitted the &quot;Join the Circle&quot; form on the storefront, newest first.
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

        <AdminNav active="leads" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: "var(--admin-muted)", fontSize: 13, margin: 0 }}>
            {leads.length} total
          </p>
          <a
            href="/admin/leads/export"
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
          {leads.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 13, padding: 24, margin: 0 }}>No leads yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Name</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Email</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Phone</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Source</th>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--admin-muted)", fontWeight: 600 }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid var(--admin-border-soft)" }}>
                      <td style={{ padding: "12px 16px" }}>{lead.name || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <a href={`mailto:${lead.email}`} style={{ color: "var(--admin-ink)", textDecoration: "none" }}>
                          {lead.email}
                        </a>
                      </td>
                      <td style={{ padding: "12px 16px" }}>{lead.phone || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{lead.source || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "var(--admin-muted)", whiteSpace: "nowrap" }}>{formatDate(lead.createdAt)}</td>
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

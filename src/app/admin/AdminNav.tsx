export default function AdminNav({ active }: { active: "products" | "content" | "leads" | "discounts" | "reports" | "guide" }) {
  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? "var(--admin-accent)" : "var(--admin-muted)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    borderBottom: isActive ? "2px solid var(--admin-accent)" : "2px solid transparent",
    paddingBottom: 6,
  });

  return (
    <nav className="print:hidden" style={{ display: "flex", gap: 24, marginBottom: 32, borderBottom: "1px solid var(--admin-border-soft)" }}>
      <a href="/admin/guide" style={linkStyle(active === "guide")}>
        Platform Guide
      </a>
      <a href="/admin/products" style={linkStyle(active === "products")}>
        Products
      </a>
      <a href="/admin/reports" style={linkStyle(active === "reports")}>
        Sales Reports
      </a>
      <a href="/admin/content" style={linkStyle(active === "content")}>
        Site Content
      </a>
      <a href="/admin/leads" style={linkStyle(active === "leads")}>
        Leads
      </a>
      <a href="/admin/discounts" style={linkStyle(active === "discounts")}>
        Discounts
      </a>
    </nav>
  );
}

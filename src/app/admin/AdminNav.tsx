const AMBER = "#D4920A";

export default function AdminNav({ active }: { active: "products" | "content" }) {
  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? AMBER : "#9A8A70",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    borderBottom: isActive ? `2px solid ${AMBER}` : "2px solid transparent",
    paddingBottom: 6,
  });

  return (
    <nav style={{ display: "flex", gap: 24, marginBottom: 32, borderBottom: `1px solid ${AMBER}22` }}>
      <a href="/admin/products" style={linkStyle(active === "products")}>
        Products
      </a>
      <a href="/admin/content" style={linkStyle(active === "content")}>
        Site Content
      </a>
    </nav>
  );
}

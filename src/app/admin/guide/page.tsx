import { logoutAdmin } from "../products/actions";
import AdminNav from "../AdminNav";
import GuideContent from "./GuideContent";

export default function AdminGuidePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: "var(--admin-accent)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Platform Guide</h1>
            <p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: 8, maxWidth: 560 }}>
              A plain-language map of how the site is built — where to log in, what each tool does, and
              what&apos;s left before the store can take real orders. Use your browser&apos;s Print
              (⌘/Ctrl+P) to save this as a PDF.
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

        <AdminNav active="guide" />
      </div>

      <GuideContent />
    </div>
  );
}

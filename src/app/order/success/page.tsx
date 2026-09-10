export default function OrderSuccessPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0A0A08", color: "#FAF7F0", textAlign: "center", padding: 24, fontFamily: "system-ui, sans-serif",
    }}>
      <p style={{ color: "#D4920A", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Order Confirmed</p>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 16 }}>Thank you ✦</h1>
      <p style={{ color: "#9A8A70", maxWidth: 480, marginBottom: 32, lineHeight: 1.6 }}>
        Your order is on its way to being handcrafted. A confirmation was sent to your email.
      </p>
      <a href="/" style={{ background: "#D4920A", color: "#0A0A08", padding: "14px 32px", textDecoration: "none", fontWeight: 700, letterSpacing: "0.08em" }}>
        Back to ELYXIER
      </a>
    </div>
  );
}

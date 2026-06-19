export default function Home() {
  const brief = [
    { label: "Brand", value: "ELYXIER" },
    { label: "Owner", value: "Data Gladden" },
    { label: "Location", value: "Las Vegas, NV" },
    { label: "Products", value: "Handmade body butters & oils" },
    { label: "Price Point", value: "$25 per product" },
    { label: "Channels", value: "TikTok Shop · Amazon · Whatnot" },
    { label: "Live Selling", value: "TikTok · Instagram · Facebook · Whatnot" },
    { label: "Goal (90 days)", value: "$10,000 in revenue" },
  ];

  const decisions = [
    "Luxury & premium aesthetic matched to brand personality",
    "Video-ready hero sections for social media content",
    "Live selling CTAs across TikTok, Instagram, Facebook & Whatnot",
    "6-product grid optimized for your current SKU count",
    "Email capture section for list building from day one",
    "Mobile-first — built for traffic from TikTok & IG Live",
    "Dark & light mode toggle on every design",
    "Headless Shopify architecture (payments, cart, reviews, abandoned cart all via Shopify)",
    "Copywritten About Us section personalized to your story",
  ];

  const designs = [
    {
      id: "design-a",
      label: "A",
      name: "Midnight Luxe",
      font: "Playfair Display + Inter",
      swatches: ["#0C0C0E", "#C9A257", "#F5F1EA"],
      desc: "Dark, editorial, high-fashion. Inspired by luxury houses like Chanel and Charlotte Tilbury. Dramatic and sophisticated.",
      recommended: false,
    },
    {
      id: "design-b",
      label: "B",
      name: "Warm Ivory",
      font: "Cormorant Garamond + DM Sans",
      swatches: ["#FAF7F2", "#CC8800", "#2A1810"],
      desc: "Warm, artisan luxury. Skin-toned palette with earthy amber. Approachable yet premium — Fenty Skin meets Tatcha.",
      recommended: false,
    },
    {
      id: "design-c",
      label: "C",
      name: "Bold Canvas",
      font: "Montserrat + Nunito",
      swatches: ["#FFFFFF", "#4A1259", "#D4A0A0"],
      desc: "High-contrast and fashion-forward. Bold plum with rose gold accents. Built for social media virality.",
      recommended: false,
    },
    {
      id: "design-d",
      label: "D",
      name: "Elevated Glam",
      font: "Bebas Neue + DM Sans",
      swatches: ["#0A0A08", "#D4920A", "#FAF7F0"],
      desc: "Your brand's personality in design form. Bold amber luxury with commanding typography that matches your energy as a creator.",
      recommended: true,
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Pick Your Direction",
      body: "Select the design that resonates most. Mix-and-match elements from multiple designs is also an option.",
    },
    {
      num: "02",
      title: "Share Your Assets",
      body: "Send us your real product photos, logo file, and any final copy for your 6 body butters.",
    },
    {
      num: "03",
      title: "We Build & Launch",
      body: "We wire up Shopify, point elyxier.com to your new store, and get you live with TikTok Shop, Amazon sync, and email capture.",
    },
  ];

  return (
    <div style={{ background: "#FAFAF8", color: "#111111", fontFamily: "var(--font-geist-sans), system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`
        .explore-btn:hover { background: #333 !important; }
        .card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .card { transition: box-shadow 0.2s, transform 0.2s; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #E8E8E4", padding: "12px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#888", textTransform: "uppercase" }}>Globalist.Pro × ELYXIER</span>
        <span style={{ fontSize: 11, color: "#AAA" }}>Design Review — June 2026</span>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "72px 0 56px" }}>
          <img src="/elyxier-logo.png" alt="ELYXIER" style={{ width: "160px", height: "auto", borderRadius: "10px", marginBottom: "24px", display: "block", margin: "0 auto 24px" }} />
          <div style={{ display: "inline-block", background: "#F0EFE9", borderRadius: 999, padding: "4px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#888", textTransform: "uppercase", marginBottom: 24 }}>
            Client Presentation
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 16px" }}>
            ELYXIER Design Review
          </h1>
          <p style={{ fontSize: 18, color: "#666", maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Four creative directions crafted for your brand. Review, compare, and choose the look that feels like you.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["4 Designs", "Light & Dark Mode"].map((chip) => (
              <span key={chip} style={{ background: "#F0EFE9", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#555", border: "1px solid #E8E8E4" }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Brief Card */}
        <div style={{ border: "1px solid #E8E8E4", borderRadius: 16, padding: "40px", marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* Left: snapshot */}
          <div>
            <div style={{ borderLeft: "3px solid #C8860A", paddingLeft: 16, marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#C8860A", textTransform: "uppercase", marginBottom: 4 }}>Your Brief</p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Client Snapshot</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {brief.map(({ label, value }) => (
                <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start", borderBottom: "1px solid #F0EFE9", paddingBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#AAA", textTransform: "uppercase", minWidth: 110, paddingTop: 1 }}>{label}</span>
                  <span style={{ fontSize: 14, color: "#111", fontWeight: 500, lineHeight: 1.5 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: design decisions */}
          <div>
            <div style={{ borderLeft: "3px solid #C8860A", paddingLeft: 16, marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#C8860A", textTransform: "uppercase", marginBottom: 4 }}>What We Built</p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Design Decisions</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {decisions.map((item) => (
                <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#C8860A", fontSize: 14, marginTop: 1, flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture callout */}
        <div style={{ background: "#FFF8ED", border: "1px solid #E8C97A", borderRadius: 12, padding: 24, marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#C8860A", textTransform: "uppercase", marginBottom: 8 }}>Recommended Architecture</p>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#111" }}>Headless Shopify + Next.js</p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: 0 }}>
            Your storefront runs on Next.js for full design control and blazing speed. Shopify handles everything behind the scenes — inventory, payments (Shopify Payments, Afterpay, Apple Pay, Google Pay, PayPal), abandoned cart recovery, product reviews, and TikTok Shop sync. You own the brand experience at elyxier.com.
          </p>
        </div>

        {/* Design cards */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>The Four Directions</h2>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 40 }}>Each design includes a light and dark mode toggle. Click to explore.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {designs.map((d) => (
              <div key={d.id} className="card" style={{ background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 16, overflow: "hidden" }}>
                {/* Swatch bar */}
                <div style={{ display: "flex", height: 80 }}>
                  {d.swatches.map((color) => (
                    <div key={color} style={{ flex: 1, background: color }} />
                  ))}
                </div>
                {/* Body */}
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F0EFE9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#333", flexShrink: 0 }}>
                      {d.label}
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{d.name}</span>
                    {d.recommended && (
                      <span style={{ background: "#C8860A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: "auto" }}>
                        ★ Recommended
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "#AAA", marginBottom: 10 }}>{d.font}</p>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>{d.desc}</p>
                  <a href={`/${d.id}`} className="explore-btn" style={{
                    display: "block", textAlign: "center", background: "#111111", color: "#FFFFFF",
                    padding: "12px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.2s",
                  }}>
                    Explore Design →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 32 }}>What Happens After You Choose</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 12, padding: 28 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#E8E8E4", marginBottom: 12, lineHeight: 1 }}>{s.num}</div>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#111" }}>{s.title}</p>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #E8E8E4", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#AAA" }}>Prepared by Globalist.Pro for ELYXIER · June 2026</span>
        <span style={{ fontSize: 12, color: "#AAA" }}>Questions? advisor@globalist.pro</span>
      </div>
    </div>
  );
}

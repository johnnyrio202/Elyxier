"use client";
import { useState, useEffect } from "react";

const products = [
  { name: "Bare Bliss", price: "$25", photo: "/bare-bliss.jpeg", blurb: "Pure, nourishing hydration without added scents. Made with organic shea butter, mango butter, and skin-loving oils that deeply moisturize and soften even the most sensitive skin. No fragrance. No unnecessary additives. Just pure hydration your skin will love." },
  { name: "Champagne Glow", price: "$25", photo: "/champagne-glow.jpeg", blurb: "A radiant body butter infused with soft shimmer and bubbly champagne notes with bright citrus accords. Shea and mango butter deliver deep hydration while a delicate shimmer leaves skin luminous and sun-kissed with every application." },
  { name: "Lilac Dreams", price: "$25", photo: "/lilac-dreams.jpeg", blurb: "A soothing blend of chamomile and soft lavender designed for your nighttime ritual. Rich shea and mango butter melt effortlessly into skin, leaving it silky smooth and beautifully nourished. Breathe it in, let go of the day, and drift into rest." },
  { name: "Pink Silk", price: "$25", photo: "/pink-silk.jpeg", blurb: "A sweet, feminine blend of juicy fruits, sparkling citrus, soft florals, and warm vanilla. This rich, creamy formula melts into skin for lasting moisture without greasiness — leaving behind a silky, irresistible scent that is both playful and elegant." },
];

export default function MidnightLuxe() {
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const t = dark ? {
    BG: "#0C0C0E",
    GOLD: "#C9A257",
    CREAM: "#F5F1EA",
    MUTED: "#6B6050",
    CARD: "#181818",
    SECTION: "#0E0E10",
    NAV: "#0C0C0EEE",
    HERO_GRAD: "linear-gradient(135deg, #0C0C0E 0%, #1A1206 50%, #0C0C0E 100%)",
  } : {
    BG: "#FAF7F2",
    GOLD: "#8B6914",
    CREAM: "#1A1508",
    MUTED: "#8B7A60",
    CARD: "#FFFFFF",
    SECTION: "#F0EDE8",
    NAV: "#FAF7F2F0",
    HERO_GRAD: "linear-gradient(135deg, #FAF7F2 0%, #F0EDE8 50%, #FAF7F2 100%)",
  };

  const { BG, GOLD, CREAM, MUTED, CARD, SECTION, NAV, HERO_GRAD } = t;

  return (
    <div style={{ background: BG, color: CREAM, fontFamily: "var(--font-inter), sans-serif", minHeight: "100vh" }}>

      {/* Dark/Light Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed", top: isMobile ? 16 : 80, right: 16, zIndex: 100,
          background: dark ? "#FAF7F2" : "#0C0C0E",
          color: dark ? "#0C0C0E" : "#FAF7F2",
          border: "none", borderRadius: 50, padding: "8px 16px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {dark ? "☀ LIGHT" : "☾ DARK"}
      </button>

      {/* Back button */}
      <a href="/" style={{
        position: "fixed", top: isMobile ? 16 : 80, left: 16, zIndex: 100,
        background: "#C9A257", color: "#0C0C0E",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>← All Designs</a>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: NAV, backdropFilter: "blur(12px)", borderBottom: `1px solid ${GOLD}22` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {!isMobile && ["Shop", "About", "Live"].map((item) => (
              <a key={item} href={item === "About" ? "#about" : "#"} style={{ color: MUTED, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                {item}
              </a>
            ))}
            <a href="#" style={{ color: CREAM, fontSize: 20, textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Logo Band */}
      <div style={{ background: "#000000", display: "flex", justifyContent: "center", alignItems: "center", padding: isMobile ? "10px 0" : "20px 0 16px", borderBottom: `1px solid ${GOLD}55` }}>
        <a href="/"><img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: isMobile ? "72px" : "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: isMobile ? "80vh" : "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80"
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.18 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: HERO_GRAD, zIndex: 1 }} />
        {!isMobile && (
          <div style={{ position: "absolute", left: "32%", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${GOLD}80, transparent)`, zIndex: 2 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${GOLD}08 0%, transparent 60%)`, zIndex: 2 }} />
        <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, margin: "0 auto", padding: isMobile ? "80px 24px" : "0 32px", width: "100%", paddingLeft: isMobile ? "24px" : "36%" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 24 }}>Luxury Skincare · Handcrafted</p>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 400, lineHeight: 1.1, marginBottom: 32, color: CREAM }}>
            Skin.<br />
            <span style={{ fontStyle: "italic", color: GOLD }}>Ritual.</span><br />
            Luxury.
          </h1>
          <p style={{ color: MUTED, fontSize: 16, maxWidth: 420, lineHeight: 1.8, marginBottom: 48 }}>
            Handcrafted body butters and oils designed to celebrate your skin and elevate your daily ritual.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#" style={{ background: GOLD, color: BG, padding: "14px 36px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600, display: "inline-block" }}>
              Shop Collection
            </a>
            <a href="#" style={{ border: `1px solid ${MUTED}`, color: MUTED, padding: "14px 36px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 500, display: "inline-block" }}>
              Our Story
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "64px 16px" : "120px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Collection</p>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: CREAM }}>Crafted for Your Ritual</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {products.map((p) => (
            <div
              key={p.name}
              style={{ perspective: "1000px", height: isMobile ? "320px" : "380px", cursor: "pointer" }}
              onMouseEnter={() => !isMobile && setFlippedCard(p.name)}
              onMouseLeave={() => !isMobile && setFlippedCard(null)}
              onClick={() => setFlippedCard(flippedCard === p.name ? null : p.name)}
            >
              <div style={{
                position: "relative", width: "100%", height: "100%",
                transformStyle: "preserve-3d" as const,
                transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: flippedCard === p.name ? "rotateY(180deg)" : "rotateY(0deg)",
              }}>
                {/* FRONT */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden" as const,
                  WebkitBackfaceVisibility: "hidden" as const,
                  background: CARD, overflow: "hidden",
                  border: `1px solid ${GOLD}33`,
                }}>
                  <div style={{ height: "72%", overflow: "hidden" }}>
                    <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ padding: "16px 20px 12px" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 17, fontWeight: 400, color: CREAM, marginBottom: 6 }}>{p.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: GOLD, fontSize: 18, fontWeight: 500 }}>{p.price}</span>
                      <span style={{ color: MUTED, fontSize: 10, letterSpacing: "0.15em" }}>✦ DISCOVER</span>
                    </div>
                  </div>
                </div>
                {/* BACK */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden" as const,
                  WebkitBackfaceVisibility: "hidden" as const,
                  transform: "rotateY(180deg)",
                  background: dark ? "#1E1A10" : "#F0EBE0",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  padding: "28px 24px",
                  border: `1px solid ${GOLD}33`,
                }}>
                  <p style={{ color: GOLD, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, marginBottom: 10 }}>The Blend</p>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 17, fontWeight: 400, color: CREAM, marginBottom: 14 }}>{p.name}</h3>
                  <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 20 }}>{p.blurb}</p>
                  <span style={{ color: GOLD, fontSize: 18, fontWeight: 500, display: "block", marginBottom: 16 }}>{p.price}</span>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${dark ? "#E8C070" : "#B08030"})`,
                      color: BG,
                      border: "none",
                      padding: "15px 0",
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase" as const,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: `0 4px 20px ${GOLD}50`,
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    Add to Ritual ✦
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ background: SECTION, padding: isMobile ? "64px 16px" : "120px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ width: 1, height: 80, background: `linear-gradient(to bottom, transparent, ${GOLD})`, margin: "0 auto 48px" }} />
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 24 }}>Our Story</p>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontStyle: "italic", color: GOLD, lineHeight: 1.4, marginBottom: 36 }}>
            Your Skin Deserves More
          </h2>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.9, marginBottom: 28, maxWidth: 620, margin: "0 auto 28px" }}>
            Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care is a ritual, not a trend. Every body butter and oil is handcrafted by hand using premium ingredients chosen to nourish, protect, and celebrate your skin. We believe luxury should never have a limit — ELYXIER is made for women of all backgrounds who invest in themselves.
          </p>
          <p style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic", color: GOLD, fontSize: 18, letterSpacing: "0.05em", marginBottom: 36 }}>
            &ldquo;Your skin. Your ritual. Your ELYXIER.&rdquo;
          </p>
          <p style={{ color: MUTED, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Data Gladden</p>
          <p style={{ color: `${MUTED}88`, fontSize: 13 }}>Founder, ELYXIER</p>
          <div style={{ width: 1, height: 80, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, margin: "48px auto 0" }} />
        </div>
      </section>

      {/* Live Shopping */}
      <section style={{ background: "#C9A257", padding: isMobile ? "48px 16px" : "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#0C0C0E", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Shop in Real Time</p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#0C0C0E", fontWeight: 700, marginBottom: 8 }}>Join Us Live</h2>
            <p style={{ color: "#3A2A00", fontSize: 15 }}>Product demos, exclusive drops, and live Q&A every week.</p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {["TikTok", "Instagram", "Facebook", "Whatnot"].map((platform) => (
              <a key={platform} href="#" style={{ background: "#0C0C0E", color: "#C9A257", padding: "10px 20px", fontSize: 12, letterSpacing: "0.1em", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
                {platform}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section style={{ background: dark ? "#0E0E10" : "#F5F1EA", padding: isMobile ? "64px 16px" : "120px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, color: GOLD, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, padding: "6px 18px", marginBottom: 24 }}>Join the Inner Circle</span>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: CREAM, marginBottom: 16, lineHeight: 1.2 }}>Your Backstage Pass to ELYXIER</h2>
          <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px" }}>
            This isn&apos;t just a newsletter — it&apos;s your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.
          </p>
          {/* Benefits */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
              { title: "✦ Beauty Tips & Rituals", body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself." },
              { title: "✦ Subscriber-Only Access", body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions." },
              { title: "✦ First at the Drop", body: "Priority access to limited product releases before they go public. Never miss a drop." },
            ].map((b) => (
              <div key={b.title} style={{ background: dark ? "#181818" : "#FFFFFF", border: `1px solid ${GOLD}22`, padding: "24px 20px", textAlign: "left" }}>
                <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 10 }}>{b.title}</p>
                <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7 }}>{b.body}</p>
              </div>
            ))}
          </div>
          {/* Form */}
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 12 }}>
            <input type="text" placeholder="Full Name" style={{ background: "transparent", border: `1px solid ${GOLD}55`, borderRadius: 2, color: CREAM, fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-inter), sans-serif" }} />
            <input type="email" placeholder="Email Address" style={{ background: "transparent", border: `1px solid ${GOLD}55`, borderRadius: 2, color: CREAM, fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-inter), sans-serif" }} />
            <input type="tel" placeholder="Phone Number" style={{ background: "transparent", border: `1px solid ${GOLD}55`, borderRadius: 2, color: CREAM, fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-inter), sans-serif" }} />
            <button style={{ background: `linear-gradient(135deg, ${GOLD}, ${dark ? "#E8C070" : "#B08030"})`, color: BG, border: "none", padding: "16px 0", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 24px ${GOLD}40`, marginTop: 4 }}>
              Join the Circle
            </button>
            <p style={{ color: `${MUTED}88`, fontSize: 11, marginTop: 4 }}>No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${GOLD}22`, padding: isMobile ? "32px 16px" : "48px 32px", background: SECTION }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <div style={{ display: "flex", gap: 28 }}>
            {["TikTok", "Instagram", "Facebook"].map((s) => (
              <a key={s} href="#" style={{ color: MUTED, fontSize: 12, letterSpacing: "0.1em", textDecoration: "none" }}>{s}</a>
            ))}
          </div>
          <p style={{ color: `${MUTED}88`, fontSize: 12 }}>© 2026 ELYXIER · elyxier702@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

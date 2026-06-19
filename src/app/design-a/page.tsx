"use client";
import { useState } from "react";

const products = [
  { name: "Whipped Shea Butter", price: "$25", photo: "1620916566398-39f1143ab7be" },
  { name: "Lavender Dreams Body Butter", price: "$25", photo: "1748543668676-ea8241cb3886" },
  { name: "Honey & Vanilla Glow", price: "$25", photo: "1748543668643-1ada33167539" },
  { name: "Rose Gold Body Oil", price: "$25", photo: "1748543668687-624e058c367c" },
];

export default function MidnightLuxe() {
  const [dark, setDark] = useState(true);

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
          position: "fixed", top: 80, right: 16, zIndex: 100,
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
        position: "fixed", top: 80, left: 16, zIndex: 100,
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
            {["Shop", "About", "Live"].map((item) => (
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
      <div style={{ background: "#000000", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0 16px", borderBottom: `1px solid ${GOLD}55` }}>
        <a href="/"><img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80"
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.18 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: HERO_GRAD, zIndex: 1 }} />
        <div style={{ position: "absolute", left: "32%", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${GOLD}80, transparent)`, zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${GOLD}08 0%, transparent 60%)`, zIndex: 2 }} />
        <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, margin: "0 auto", padding: "0 32px", width: "100%", paddingLeft: "36%" }}>
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
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Collection</p>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: CREAM }}>Crafted for Your Ritual</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {products.map((p) => (
            <div key={p.name} style={{ background: CARD, border: `1px solid ${GOLD}33`, display: "flex", flexDirection: "column", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.border = `1px solid ${GOLD}88`)}
              onMouseLeave={e => (e.currentTarget.style.border = `1px solid ${GOLD}33`)}>
              <div style={{ position: "relative", width: "100%", height: "280px", overflow: "hidden" }}>
                <img
                  src={`https://images.unsplash.com/photo-${p.photo}?w=600&h=600&fit=crop&q=80`}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <span style={{ position: "absolute", top: 10, right: 10, background: GOLD, color: BG, fontSize: 9, letterSpacing: "0.2em", padding: "4px 10px", fontWeight: 700, textTransform: "uppercase" }}>Handcrafted</span>
              </div>
              <div style={{ padding: "24px 20px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 18, fontWeight: 400, color: CREAM, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: GOLD, fontSize: 16, fontWeight: 500 }}>{p.price}</span>
                  <a href="#" style={{ color: MUTED, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>Add to Cart</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ background: SECTION, padding: "120px 32px", textAlign: "center" }}>
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
      <section style={{ background: "#C9A257", padding: "80px 32px" }}>
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

      {/* Email Capture */}
      <section style={{ background: BG, padding: "120px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ color: GOLD, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Inner Circle</p>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 36, color: CREAM, marginBottom: 12 }}>First Access. Always.</h2>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 40, lineHeight: 1.8 }}>New drops, exclusive offers, and self-care rituals — delivered to you first.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ background: "transparent", border: "none", borderBottom: `1px solid ${GOLD}`, color: CREAM, fontSize: 16, padding: "12px 0", outline: "none", textAlign: "center", marginBottom: 24 }}
            />
            <button style={{ background: GOLD, color: BG, border: "none", padding: "14px 0", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
              Join the Circle
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${GOLD}22`, padding: "48px 32px", background: SECTION }}>
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

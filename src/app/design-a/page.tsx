"use client";
import { useState } from "react";

const products = [
  { name: "Whipped Shea Butter", price: "$28", gradient: "linear-gradient(135deg, #3D2B00 0%, #C9A257 60%, #6B4A10 100%)" },
  { name: "Lavender Dreams Body Butter", price: "$35", gradient: "linear-gradient(135deg, #2A1A40 0%, #9B7EC8 60%, #C9A257 100%)" },
  { name: "Honey & Vanilla Glow", price: "$38", gradient: "linear-gradient(135deg, #5C3800 0%, #E8B84B 60%, #A07020 100%)" },
  { name: "Rose Gold Body Oil", price: "$45", gradient: "linear-gradient(135deg, #3D1A1A 0%, #E8A0A0 50%, #C9A257 100%)" },
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

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: NAV, backdropFilter: "blur(12px)", borderBottom: `1px solid ${GOLD}22` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-playfair), serif", fontSize: 24, fontWeight: 700, color: GOLD, letterSpacing: "0.12em" }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Shop", "About", "Live"].map((item) => (
              <a key={item} href="#" style={{ color: MUTED, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}
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

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: HERO_GRAD }} />
        <div style={{ position: "absolute", left: "32%", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${GOLD}80, transparent)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${GOLD}08 0%, transparent 60%)` }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 32px", width: "100%", paddingLeft: "36%" }}>
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
              <div style={{ height: 280, background: p.gradient, position: "relative" }}>
                <span style={{ position: "absolute", top: 16, left: 16, background: GOLD, color: BG, fontSize: 9, letterSpacing: "0.2em", padding: "4px 10px", fontWeight: 700, textTransform: "uppercase" }}>Handcrafted</span>
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
      <section style={{ background: SECTION, padding: "120px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ width: 1, height: 80, background: `linear-gradient(to bottom, transparent, ${GOLD})`, margin: "0 auto 48px" }} />
          <blockquote style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(24px, 3.5vw, 44px)", fontStyle: "italic", color: GOLD, lineHeight: 1.5, marginBottom: 40 }}>
            &ldquo;Every jar is a love letter to your skin — made with intention, care, and the finest ingredients.&rdquo;
          </blockquote>
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
          <span style={{ fontFamily: "var(--font-playfair), serif", fontSize: 20, color: GOLD, letterSpacing: "0.12em" }}>ELYXIER</span>
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

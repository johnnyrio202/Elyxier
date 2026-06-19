"use client";
import { useState } from "react";

const products = [
  { name: "Whipped Shea Butter", price: "$28", gradient: "linear-gradient(160deg, #9B4DB5 0%, #D4A0A0 50%, #E8C8C8 100%)" },
  { name: "Lavender Dreams Body Butter", price: "$35", gradient: "linear-gradient(160deg, #6A2090 0%, #A070C0 50%, #D4A0D4 100%)" },
  { name: "Honey & Vanilla Glow", price: "$38", gradient: "linear-gradient(160deg, #C41E3A 0%, #D4A0A0 50%, #FFE0E0 100%)" },
  { name: "Rose Gold Body Oil", price: "$45", gradient: "linear-gradient(160deg, #8B2050 0%, #D4A0A0 45%, #FFD0E8 100%)" },
];

export default function BoldCanvas() {
  const [dark, setDark] = useState(false);

  const t = dark ? {
    WHITE: "#0D0010",
    PLUM: "#B060CC",
    ROSE: "#E8B4B8",
    RED: "#E83A5A",
    LIGHT_PLUM: "#1A0025",
    TEXT_DARK: "#F5F0FF",
    TEXT_MID: "#C8A0D8",
    NAV_BORDER: "#B060CC",
    CARD_BG: "#1A0025",
  } : {
    WHITE: "#FFFFFF",
    PLUM: "#4A1259",
    ROSE: "#D4A0A0",
    RED: "#C41E3A",
    LIGHT_PLUM: "#F5EFF8",
    TEXT_DARK: "#1A0A20",
    TEXT_MID: "#7A4A8A",
    NAV_BORDER: "#4A1259",
    CARD_BG: "#FFFFFF",
  };

  const { WHITE, PLUM, ROSE, RED, LIGHT_PLUM, TEXT_DARK, TEXT_MID, NAV_BORDER, CARD_BG } = t;

  return (
    <div style={{ background: WHITE, color: TEXT_DARK, fontFamily: "var(--font-nunito), sans-serif", minHeight: "100vh" }}>

      {/* Dark/Light Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed", top: 80, right: 16, zIndex: 100,
          background: dark ? "#F5F0FF" : "#0D0010",
          color: dark ? "#0D0010" : "#F5F0FF",
          border: "none", borderRadius: 50, padding: "8px 16px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {dark ? "☀ LIGHT" : "☾ DARK"}
      </button>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: WHITE, borderBottom: `3px solid ${NAV_BORDER}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 22, fontWeight: 900, color: PLUM, letterSpacing: "0.15em", textTransform: "uppercase" }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Shop", "About", "Live"].map((item) => (
              <a key={item} href="#" style={{ color: TEXT_DARK, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.color = PLUM)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_DARK)}>
                {item}
              </a>
            ))}
            <a href="#" style={{ background: PLUM, color: WHITE, padding: "8px 18px", fontSize: 12, letterSpacing: "0.08em", textDecoration: "none", fontWeight: 700, fontFamily: "var(--font-montserrat), sans-serif", borderRadius: 4 }}>
              Cart 0
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "95vh", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
        <div style={{ background: PLUM, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 60px" }}>
          <p style={{ color: ROSE, fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 24, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 600 }}>
            Luxury · Handcrafted · Elevated
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(40px, 5.5vw, 80px)", fontWeight: 900, color: WHITE, lineHeight: 1.0, textTransform: "uppercase", marginBottom: 32, letterSpacing: "-0.01em" }}>
            BODY<br />
            BUTTER.<br />
            <span style={{ color: ROSE, WebkitTextStroke: `1px ${ROSE}`, WebkitTextFillColor: "transparent" }}>REDEFINED.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, maxWidth: 400, marginBottom: 48, fontFamily: "var(--font-nunito), sans-serif" }}>
            Handmade in small batches for women who refuse to settle. Premium ingredients. Real results. Real glow.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#" style={{ background: WHITE, color: PLUM, padding: "16px 44px", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800, fontFamily: "var(--font-montserrat), sans-serif", borderRadius: 4 }}>
              Shop Now
            </a>
            <a href="#" style={{ background: "transparent", color: WHITE, border: `2px solid ${ROSE}`, padding: "16px 44px", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, fontFamily: "var(--font-montserrat), sans-serif", borderRadius: 4 }}>
              Watch Live
            </a>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #7A1A9B 0%, #C41E3A 40%, #D4A0A0 75%, #FFE8E8 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: "15%", left: "5%", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ width: 240, height: 300, margin: "0 auto", borderRadius: "50% 50% 45% 45%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-montserrat), sans-serif" }}>Product Image</span>
            </div>
            <div style={{ marginTop: 20, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "8px 24px", display: "inline-block" }}>
              <span style={{ color: WHITE, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>NEW DROP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "100px 40px", background: LIGHT_PLUM }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60 }}>
            <div>
              <p style={{ color: PLUM, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>Our Products</p>
              <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: TEXT_DARK, textTransform: "uppercase", letterSpacing: "-0.01em" }}>THE COLLECTION</h2>
            </div>
            <a href="#" style={{ color: PLUM, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `2px solid ${PLUM}`, paddingBottom: 2, fontFamily: "var(--font-montserrat), sans-serif" }}>
              View All →
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {products.map((p) => (
              <div key={p.name} style={{ background: CARD_BG, borderRadius: 8, overflow: "hidden", cursor: "pointer", boxShadow: `0 2px 12px rgba(74,18,89,${dark ? "0.25" : "0.08"})` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px rgba(74,18,89,${dark ? "0.4" : "0.15"})`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 12px rgba(74,18,89,${dark ? "0.25" : "0.08"})`; }}>
                <div style={{ height: 240, background: p.gradient }} />
                <div style={{ padding: "20px 20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 15, fontWeight: 800, color: PLUM, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.3 }}>{p.name}</h3>
                    <span style={{ background: ROSE, color: WHITE, fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 50, whiteSpace: "nowrap", fontFamily: "var(--font-montserrat), sans-serif", flexShrink: 0, marginLeft: 8 }}>{p.price}</span>
                  </div>
                  <button style={{ width: "100%", background: PLUM, color: WHITE, border: "none", padding: "12px 0", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", borderRadius: 4, fontFamily: "var(--font-montserrat), sans-serif" }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ background: PLUM, padding: "120px 40px", textAlign: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(196,30,58,0.15)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(212,160,160,0.1)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <p style={{ color: ROSE, fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 24, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>About ELYXIER</p>
          <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", lineHeight: 1.05, marginBottom: 40, letterSpacing: "-0.02em" }}>
            MADE FOR WOMEN<br />WHO GLOW DIFFERENT.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 48px", fontFamily: "var(--font-nunito), sans-serif" }}>
            ELYXIER is handcrafted luxury skincare made by women, for women. Every product is made in small batches with premium ingredients to give your skin the royal treatment it deserves.
          </p>
          <a href="#" style={{ background: ROSE, color: "#FFFFFF", padding: "16px 48px", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800, borderRadius: 4, fontFamily: "var(--font-montserrat), sans-serif", display: "inline-block" }}>
            Our Full Story
          </a>
        </div>
      </section>

      {/* Live Shopping */}
      <section style={{ background: `linear-gradient(90deg, ${RED} 0%, ${PLUM} 100%)`, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: ROSE, fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>Live Shopping</p>
              <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", lineHeight: 1.05, marginBottom: 8 }}>
                SHOP<br />LIVE NOW.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, fontFamily: "var(--font-nunito), sans-serif" }}>Exclusive drops, demos & deals — every week.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { name: "TikTok", handle: "@ELYXIER702" },
                { name: "Instagram", handle: "@ELYXIER702" },
                { name: "Facebook", handle: "ELYXIER" },
                { name: "Whatnot", handle: "Coming Soon" },
              ].map((p) => (
                <div key={p.name} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "16px 24px", textAlign: "center", minWidth: 120 }}>
                  <div style={{ color: "#FFFFFF", fontFamily: "var(--font-montserrat), sans-serif", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{p.handle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email */}
      <section style={{ background: PLUM, padding: "100px 40px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: ROSE, fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 16, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>Get First Access</p>
          <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 12, letterSpacing: "-0.01em" }}>
            JOIN THE LIST.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 40, fontFamily: "var(--font-nunito), sans-serif" }}>
            New drops, exclusive deals, and early access — only for our community.
          </p>
          <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 6, display: "flex", gap: 6 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ flex: 1, background: "transparent", border: "none", padding: "12px 16px", fontSize: 15, outline: "none", color: TEXT_DARK, fontFamily: "var(--font-nunito), sans-serif" }}
            />
            <button style={{ background: RED, color: "#FFFFFF", border: "none", padding: "12px 28px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800, cursor: "pointer", borderRadius: 4, fontFamily: "var(--font-montserrat), sans-serif", whiteSpace: "nowrap" }}>
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: TEXT_DARK, padding: "48px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 20, fontWeight: 900, color: "#FFFFFF", letterSpacing: "0.15em", textTransform: "uppercase" }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 28 }}>
            {["TikTok", "Instagram", "Facebook"].map((s) => (
              <a key={s} href="#" style={{ color: ROSE, fontSize: 13, textDecoration: "none", fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s}</a>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>© 2026 ELYXIER · elyxier702@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

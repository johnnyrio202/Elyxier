"use client";
import { useState } from "react";

const products = [
  { name: "Whipped Shea Butter", price: "$25", photo: "1620916566398-39f1143ab7be" },
  { name: "Lavender Dreams Body Butter", price: "$25", photo: "1748543668676-ea8241cb3886" },
  { name: "Honey & Vanilla Glow", price: "$25", photo: "1748543668643-1ada33167539" },
  { name: "Rose Gold Body Oil", price: "$25", photo: "1748543668687-624e058c367c" },
];

export default function WarmIvory() {
  const [dark, setDark] = useState(false);

  const t = dark ? {
    IVORY: "#1A0C06",
    CHOC: "#FAF7F2",
    AMBER: "#E09A1A",
    BLUSH: "#2A1810",
    TEXT_LIGHT: "#CC9060",
    CARD: "#2A1810",
    FOOTER_BG: "#0D0604",
  } : {
    IVORY: "#FAF7F2",
    CHOC: "#2A1810",
    AMBER: "#CC8800",
    BLUSH: "#F2E8E0",
    TEXT_LIGHT: "#6B4A30",
    CARD: "#FAF7F2",
    FOOTER_BG: "#2A1810",
  };

  const { IVORY, CHOC, AMBER, BLUSH, TEXT_LIGHT, CARD, FOOTER_BG } = t;

  return (
    <div style={{ background: IVORY, color: CHOC, fontFamily: "var(--font-dm-sans), sans-serif", minHeight: "100vh" }}>

      {/* Dark/Light Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed", top: 80, right: 16, zIndex: 100,
          background: dark ? "#FAF7F2" : "#2A1810",
          color: dark ? "#2A1810" : "#FAF7F2",
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
        background: "#FAF7F2", color: "#2A1810", border: "1px solid #CC8800",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>← All Designs</a>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: `${IVORY}F0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${AMBER}22` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, fontWeight: 600, color: CHOC, letterSpacing: "0.08em" }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Shop", "About", "Live"].map((item) => (
              <a key={item} href={item === "About" ? "#about" : "#"} style={{ color: TEXT_LIGHT, fontSize: 14, letterSpacing: "0.04em", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_LIGHT)}>
                {item}
              </a>
            ))}
            <a href="#" style={{ color: CHOC, fontSize: 20, textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80"
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.15 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${IVORY} 0%, ${BLUSH} 100%)`, zIndex: 1, opacity: 0.92 }} />
        <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "44%", height: "80vh", background: `radial-gradient(ellipse, ${AMBER}26 0%, ${AMBER}10 40%, transparent 80%)`, borderRadius: "50% 0 0 50%", opacity: dark ? 0.3 : 0.15, zIndex: 2 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 3 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>Handcrafted with Love</p>
            <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(44px, 6vw, 80px)", fontWeight: 400, lineHeight: 1.15, color: CHOC, marginBottom: 28 }}>
              Nourish Your Skin.<br />
              <span style={{ fontStyle: "italic", color: AMBER }}>Celebrate</span><br />
              Your Glow.
            </h1>
            <p style={{ color: TEXT_LIGHT, fontSize: 16, lineHeight: 1.9, maxWidth: 400, marginBottom: 48 }}>
              Luxurious body butters and oils made for women who celebrate themselves — every single day.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#" style={{ background: AMBER, color: "#FFF", padding: "15px 40px", fontSize: 14, borderRadius: 50, textDecoration: "none", fontWeight: 500 }}>
                Shop Now
              </a>
              <a href="#" style={{ border: `1.5px solid ${CHOC}`, color: CHOC, padding: "15px 40px", fontSize: 14, borderRadius: 50, textDecoration: "none", fontWeight: 400 }}>
                Our Story
              </a>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 380, height: 480, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #FFF0C0 0%, #E8B84B 35%, #CC8800 60%, #8B5500 85%, #3D2800 100%)", overflow: "hidden" }} />
              <div style={{ position: "absolute", bottom: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: BLUSH, border: `3px solid ${AMBER}44` }} />
              <div style={{ position: "absolute", top: -10, left: -20, width: 80, height: 80, borderRadius: "50%", background: BLUSH, border: `2px solid ${AMBER}33` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ background: BLUSH, padding: "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Our Products</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 400, color: CHOC }}>Made for Your Skin</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
            {products.map((p) => (
              <div key={p.name} style={{ background: CARD, borderRadius: 20, overflow: "hidden", boxShadow: dark ? "0 2px 20px #00000030" : "0 2px 20px #00000010", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = dark ? "0 8px 40px #00000050" : "0 8px 40px #00000018")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = dark ? "0 2px 20px #00000030" : "0 2px 20px #00000010")}>
                <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden" }}>
                  <img
                    src={`https://images.unsplash.com/photo-${p.photo}?w=600&h=600&fit=crop&q=80`}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, fontWeight: 500, color: CHOC, marginBottom: 8 }}>{p.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: AMBER, fontSize: 18, fontFamily: "var(--font-cormorant), serif", fontWeight: 600 }}>{p.price}</span>
                    <button style={{ background: AMBER, color: "#FFF", border: "none", padding: "8px 20px", borderRadius: 50, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "120px 40px", background: IVORY }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 340, height: 420, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(160deg, #FFF0C0 0%, #E8B84B 30%, #CC8800 60%, #8B5500 100%)" }} />
              <div style={{ position: "absolute", bottom: -24, right: -24, width: 140, height: 140, borderRadius: "50%", background: BLUSH, border: `3px solid ${AMBER}` }} />
            </div>
          </div>
          <div>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Our Story</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 400, color: CHOC, lineHeight: 1.2, marginBottom: 28 }}>
              Made with Love.<br /><em>Worn with Confidence.</em>
            </h2>
            <p style={{ color: TEXT_LIGHT, fontSize: 16, lineHeight: 1.9, marginBottom: 20 }}>
              Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care is a ritual, not a trend. Every body butter and oil is handcrafted by hand using premium ingredients chosen to nourish, protect, and celebrate your skin.
            </p>
            <p style={{ color: TEXT_LIGHT, fontSize: 16, lineHeight: 1.9, marginBottom: 12 }}>
              We believe luxury should never have a limit — ELYXIER is made for women of all backgrounds who invest in themselves.
            </p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: AMBER, fontSize: 18, marginBottom: 36 }}>
              Your skin. Your ritual. Your ELYXIER.
            </p>
            <a href="#" style={{ color: CHOC, fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: `2px solid ${AMBER}`, paddingBottom: 3 }}>
              Read Our Full Story →
            </a>
          </div>
        </div>
      </section>

      {/* Live Shopping */}
      <section style={{ background: `linear-gradient(135deg, #CC7700, #E8A030)`, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#FFF8EE", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Live Shopping</p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(36px, 4vw, 56px)", color: "#FFF", marginBottom: 16 }}>Watch. Shop. Glow.</h2>
          <p style={{ color: "#FFF8EE", fontSize: 16, marginBottom: 48, opacity: 0.85 }}>Join us live for exclusive demos, Q&A, and real-time deals across all platforms.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { name: "TikTok", handle: "@ELYXIER702" },
              { name: "Instagram", handle: "@ELYXIER702" },
              { name: "Facebook", handle: "ELYXIER" },
              { name: "Whatnot", handle: "Coming Soon" },
            ].map((p) => (
              <div key={p.name} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "20px 28px", textAlign: "center", border: "1px solid rgba(255,255,255,0.3)", minWidth: 140 }}>
                <div style={{ color: "#FFF", fontFamily: "var(--font-cormorant), serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: "#FFF8EE", fontSize: 12, opacity: 0.8 }}>{p.handle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email */}
      <section style={{ background: IVORY, padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", background: BLUSH, borderRadius: 24, padding: "64px 48px" }}>
          <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Stay in the Glow</p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 40, color: CHOC, marginBottom: 12 }}>Join Our Community</h2>
          <p style={{ color: TEXT_LIGHT, fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>New arrivals, self-care rituals, and exclusive offers — just for you.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{ background: "#FFF", border: `1.5px solid ${AMBER}44`, borderRadius: 50, padding: "14px 24px", fontSize: 15, outline: "none", color: CHOC, textAlign: "center" }}
            />
            <button style={{ background: AMBER, color: "#FFF", border: "none", borderRadius: 50, padding: "14px 0", fontSize: 15, cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${AMBER}22`, padding: "48px 40px", background: FOOTER_BG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, color: AMBER, letterSpacing: "0.08em" }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 28 }}>
            {["TikTok", "Instagram", "Facebook"].map((s) => (
              <a key={s} href="#" style={{ color: BLUSH, fontSize: 13, textDecoration: "none", opacity: 0.7 }}>{s}</a>
            ))}
          </div>
          <p style={{ color: BLUSH, fontSize: 12, opacity: 0.5 }}>© 2026 ELYXIER · elyxier702@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

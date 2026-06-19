"use client";
import { useState } from "react";

const BEBAS = "var(--font-bebas), Impact, sans-serif";
const DM = "var(--font-dm-sans), system-ui, sans-serif";

const products = [
  {
    name: "Original Whipped Shea",
    desc: "The classic. Rich, whipped, and deeply nourishing.",
    gradient: "linear-gradient(145deg, #5C3800 0%, #D4920A 45%, #F0C040 80%, #E8A820 100%)",
  },
  {
    name: "Lavender & Honey",
    desc: "Calming lavender meets sweet honey for restful skin.",
    gradient: "linear-gradient(145deg, #2A1A50 0%, #9B7EC8 40%, #D4920A 80%, #E8B820 100%)",
  },
  {
    name: "Vanilla Glow",
    desc: "Warm vanilla that leaves skin glowing and soft.",
    gradient: "linear-gradient(160deg, #3D2000 0%, #C8780A 35%, #F5C842 70%, #FAE090 100%)",
  },
  {
    name: "Cocoa Butter Revival",
    desc: "Deep moisture with rich cocoa and shea.",
    gradient: "linear-gradient(130deg, #1A0A00 0%, #6B3A10 40%, #C8780A 75%, #D4920A 100%)",
  },
  {
    name: "Rose Petal Silk",
    desc: "Delicate rose infused body butter for silky skin.",
    gradient: "linear-gradient(150deg, #3D1010 0%, #C86040 40%, #E8A080 70%, #D4920A 100%)",
  },
  {
    name: "Citrus Burst",
    desc: "Energizing citrus blend to wake up your skin.",
    gradient: "linear-gradient(140deg, #3A2800 0%, #D4920A 35%, #F5D040 65%, #FAEE80 100%)",
  },
];

const testimonials = [
  { quote: "This body butter changed my entire routine. My skin has never felt so soft!", name: "Jasmine T." },
  { quote: "I bought the Lavender & Honey and I'm obsessed. Already ordered 3 more!", name: "Monique R." },
  { quote: "Found her on TikTok Live and immediately bought everything. Worth every penny.", name: "Tasha W." },
];

export default function ElevatedGlam() {
  const [dark, setDark] = useState(true);

  const t = dark ? {
    BG: "#0A0A08",
    TEXT: "#FAF7F0",
    AMBER: "#D4920A",
    AMBER_GLOW: "#E8A820",
    CARD: "#141410",
    SECTION: "#0F0F0C",
    NAV_BORDER: "#D4920A33",
    MUTED: "#9A8A70",
    INPUT_BG: "#FAF7F0",
    INPUT_TEXT: "#0A0A08",
    BTN_PRIMARY_BG: "#D4920A",
    BTN_PRIMARY_TEXT: "#0A0A08",
    FOOTER_BG: "#050504",
    STORY_BG: "#0F0F0C",
    STORY_TEXT: "#FAF7F0",
    STORY_E_BG: "#D4920A22",
    STORY_E_TEXT: "#D4920A",
  } : {
    BG: "#FAF7F0",
    TEXT: "#0A0A08",
    AMBER: "#C8860A",
    AMBER_GLOW: "#D4920A",
    CARD: "#FFFFFF",
    SECTION: "#F0EBE0",
    NAV_BORDER: "#C8860A33",
    MUTED: "#6B5A40",
    INPUT_BG: "#FFFFFF",
    INPUT_TEXT: "#0A0A08",
    BTN_PRIMARY_BG: "#0A0A08",
    BTN_PRIMARY_TEXT: "#FAF7F0",
    FOOTER_BG: "#0A0A08",
    STORY_BG: "#C8860A",
    STORY_TEXT: "#0A0A08",
    STORY_E_BG: "rgba(255,255,255,0.2)",
    STORY_E_TEXT: "#0A0A08",
  };

  return (
    <div style={{ background: t.BG, color: t.TEXT, fontFamily: DM, minHeight: "100vh" }}>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* Dark/Light Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed", top: 80, right: 16, zIndex: 100,
          background: dark ? "#FAF7F0" : "#0A0A08",
          color: dark ? "#0A0A08" : "#FAF7F0",
          border: "none", borderRadius: 50, padding: "8px 16px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          fontFamily: DM,
        }}
      >
        {dark ? "☀ LIGHT" : "☾ DARK"}
      </button>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${t.BG}F0`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${t.NAV_BORDER}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: "0.18em", color: t.AMBER }}>ELYXIER</span>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Shop", "About", "Live", "Contact"].map((item) => (
              <a key={item} href="#" style={{ color: t.MUTED, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: DM, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = t.MUTED)}>
                {item}
              </a>
            ))}
            <a href="#" style={{ color: t.TEXT, textDecoration: "none", display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: t.BG }} />
        <div style={{ position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)", width: "55%", height: "90vh", background: `radial-gradient(ellipse at center, ${t.AMBER_GLOW}18 0%, ${t.AMBER}0A 45%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "5%", top: "20%", width: 300, height: 300, background: `radial-gradient(circle, ${t.AMBER}12 0%, transparent 70%)`, borderRadius: "50%" }} />

        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "120px 32px", width: "100%" }}>
          <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontFamily: DM, fontWeight: 600 }}>
            HANDCRAFTED · LAS VEGAS · SINCE 2026
          </p>
          <h1 style={{ fontFamily: BEBAS, fontSize: "clamp(64px, 9vw, 130px)", lineHeight: 0.95, marginBottom: 32, color: t.TEXT, letterSpacing: "0.04em" }}>
            YOUR SKIN<br />
            <span style={{ color: t.AMBER }}>DESERVES</span><br />
            THE RITUAL
          </h1>
          <p style={{ color: t.MUTED, fontSize: 18, maxWidth: 480, lineHeight: 1.75, marginBottom: 52, fontFamily: DM }}>
            Luxury body butters & oils made for women who invest in themselves.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#" style={{ background: t.AMBER, color: "#0A0A08", padding: "16px 44px", fontFamily: BEBAS, fontSize: 18, letterSpacing: "0.12em", textDecoration: "none", display: "inline-block" }}>
              SHOP NOW
            </a>
            <a href="#" style={{ border: `2px solid ${t.AMBER}`, color: t.AMBER, padding: "16px 44px", fontFamily: BEBAS, fontSize: 18, letterSpacing: "0.12em", textDecoration: "none", display: "inline-block", background: "transparent" }}>
              WATCH US LIVE
            </a>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div style={{ background: t.AMBER, overflow: "hidden", padding: "12px 0", borderTop: `2px solid ${t.AMBER_GLOW}`, borderBottom: `2px solid ${t.AMBER_GLOW}` }}>
        <div style={{ display: "flex", width: "200%", animation: "marquee 22s linear infinite" }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ whiteSpace: "nowrap", flex: "0 0 50%", fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.25em", color: "#0A0A08", paddingRight: 0 }}>
              WHIPPED &nbsp;·&nbsp; HANDMADE &nbsp;·&nbsp; SKIN RITUAL &nbsp;·&nbsp; NOURISH &nbsp;·&nbsp; GLOW &nbsp;·&nbsp; LIVE SELLING &nbsp;·&nbsp; LAS VEGAS &nbsp;·&nbsp; ELYXIER &nbsp;·&nbsp; WHIPPED &nbsp;·&nbsp; HANDMADE &nbsp;·&nbsp; SKIN RITUAL &nbsp;·&nbsp; NOURISH &nbsp;·&nbsp; GLOW &nbsp;·&nbsp; LIVE SELLING &nbsp;·&nbsp; LAS VEGAS &nbsp;·&nbsp; ELYXIER &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Products */}
      <section style={{ padding: "120px 32px", background: t.BG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 16, fontFamily: DM, fontWeight: 600 }}>Our Products</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: "0.06em", color: t.TEXT }}>THE COLLECTION</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {products.map((p) => (
              <div key={p.name} style={{ background: t.CARD, display: "flex", flexDirection: "column", cursor: "pointer", border: `1px solid ${t.AMBER}20` }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${t.AMBER}66`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${t.AMBER}20`; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ height: 220, background: p.gradient, position: "relative" }}>
                  <span style={{ position: "absolute", top: 12, left: 12, color: t.AMBER, fontFamily: BEBAS, fontSize: 11, letterSpacing: "0.2em" }}>HANDCRAFTED</span>
                </div>
                <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: "0.06em", color: t.TEXT, marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16, fontFamily: DM }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.05em" }}>$25.00</span>
                    <button style={{ background: t.BTN_PRIMARY_BG, color: t.BTN_PRIMARY_TEXT, border: "none", padding: "8px 20px", fontFamily: BEBAS, fontSize: 14, letterSpacing: "0.1em", cursor: "pointer" }}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section style={{ background: t.STORY_BG, padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 280, height: 280, borderRadius: "50%", background: t.STORY_E_BG, border: `2px solid ${t.AMBER}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: BEBAS, fontSize: 160, color: t.STORY_E_TEXT, lineHeight: 1, opacity: 0.9 }}>E</span>
            </div>
          </div>
          <div>
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.35em", marginBottom: 20 }}>OUR STORY</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(36px, 4.5vw, 60px)", color: t.STORY_TEXT, lineHeight: 1.05, letterSpacing: "0.04em", marginBottom: 28 }}>
              MADE WITH INTENTION.<br />WORN WITH CONFIDENCE.
            </h2>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 36, fontFamily: DM }}>
              ELYXIER was born from a deep love of self-care and a commitment to quality. Every body butter is handcrafted in Las Vegas with premium ingredients chosen to nourish, protect, and celebrate your skin. We believe luxury shouldn&apos;t be reserved for a few — it&apos;s your daily ritual.
            </p>
            <a href="#" style={{ background: t.AMBER, color: "#0A0A08", padding: "14px 36px", fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.12em", textDecoration: "none", display: "inline-block" }}>
              MEET THE MAKER
            </a>
          </div>
        </div>
      </section>

      {/* Live Selling CTA */}
      <section style={{ background: dark ? "#080806" : "#FAF7F0", padding: "100px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {dark && (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${t.AMBER}10 0%, transparent 65%)` }} />
        )}
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.4em", marginBottom: 20 }}>CATCH US LIVE</p>
          <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(56px, 8vw, 110px)", color: t.TEXT, lineHeight: 0.95, letterSpacing: "0.04em", marginBottom: 28 }}>
            SHOP WITH<br /><span style={{ color: t.AMBER }}>US LIVE</span>
          </h2>
          <p style={{ color: t.MUTED, fontSize: 17, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px", fontFamily: DM }}>
            Join us on TikTok, Instagram, Facebook, and Whatnot for live selling events, product drops, and exclusive deals.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {["TikTok", "Instagram", "Facebook", "Whatnot"].map((p) => (
              <a key={p} href="#" style={{ background: t.BTN_PRIMARY_BG, color: t.BTN_PRIMARY_TEXT, padding: "12px 28px", fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.12em", textDecoration: "none", display: "inline-block", borderRadius: 2 }}>
                {p}
              </a>
            ))}
          </div>
          <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.2em" }}>FOLLOW @ELYXIER702 FOR LIVE ALERTS</p>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: t.SECTION, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.4em", marginBottom: 16 }}>REAL REVIEWS</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(40px, 5vw, 64px)", color: t.TEXT, letterSpacing: "0.05em" }}>WHAT THEY'RE SAYING</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: t.CARD, padding: "32px 28px", borderLeft: `3px solid ${t.AMBER}` }}>
                <p style={{ color: t.MUTED, fontSize: 15, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20, fontFamily: DM }}>
                  &ldquo;{r.quote}&rdquo;
                </p>
                <span style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.1em", color: t.AMBER }}>— {r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section style={{ background: dark ? "#0A0A08" : t.AMBER, padding: "100px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ color: dark ? t.AMBER : "#0A0A08", fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.4em", marginBottom: 20 }}>EXCLUSIVE ACCESS</p>
          <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(48px, 6vw, 80px)", color: dark ? t.TEXT : "#0A0A08", letterSpacing: "0.05em", marginBottom: 16 }}>
            JOIN THE RITUAL
          </h2>
          <p style={{ color: dark ? t.MUTED : "#3A2800", fontSize: 16, lineHeight: 1.75, marginBottom: 44, fontFamily: DM }}>
            Get early access to new drops, live event alerts, and exclusive offers.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}`, padding: "16px 24px", fontSize: 15, outline: "none", fontFamily: DM, borderRadius: 2 }}
            />
            <button style={{ background: dark ? t.AMBER : "#0A0A08", color: dark ? "#0A0A08" : "#FAF7F0", border: "none", padding: "16px 0", fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.15em", cursor: "pointer" }}>
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: t.FOOTER_BG, padding: "56px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontFamily: BEBAS, fontSize: 40, letterSpacing: "0.2em", color: t.AMBER }}>ELYXIER</span>
            <p style={{ color: "#6B6050", fontSize: 13, marginTop: 8, letterSpacing: "0.1em", fontFamily: DM }}>
              Luxury Body Butters & Oils · Handcrafted in Las Vegas
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 32 }}>
            {["TikTok", "Instagram", "Facebook", "Whatnot", "Amazon"].map((s) => (
              <a key={s} href="#" style={{ color: "#6B6050", fontSize: 12, textDecoration: "none", letterSpacing: "0.1em", fontFamily: DM, textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = "#6B6050")}>
                {s}
              </a>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1A1A14", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: DM }}>© 2026 ELYXIER. All rights reserved.</p>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: DM }}>Temperature-sensitive products. Ships with care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

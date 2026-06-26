"use client";
import { useState, useEffect } from "react";

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

const products = [
  { name: "Original Whipped Shea", desc: "The classic. Rich, whipped, and deeply nourishing.", photo: "/product-1.jpeg" },
  { name: "Lavender & Honey", desc: "Calming lavender meets sweet honey for restful skin.", photo: "/product-2.jpeg" },
  { name: "Vanilla Glow", desc: "Warm vanilla that leaves skin glowing and soft.", photo: "/product-3.jpeg" },
  { name: "Cocoa Butter Revival", desc: "Deep moisture with rich cocoa and shea.", photo: "/product-4.jpeg" },
  { name: "Rose Petal Silk", desc: "Delicate rose infused body butter for silky skin.", photo: "https://images.unsplash.com/photo-1619451427882-6aaaded0cc61?w=600&h=600&fit=crop&q=80" },
  { name: "Citrus Burst", desc: "Energizing citrus blend to wake up your skin.", photo: "https://images.unsplash.com/photo-1629380108599-ea06489d66f5?w=600&h=600&fit=crop&q=80" },
];

const testimonials = [
  { quote: "This body butter changed my entire routine. My skin has never felt so soft!", name: "Jasmine T." },
  { quote: "I bought the Lavender & Honey and I'm obsessed. Already ordered 3 more!", name: "Monique R." },
  { quote: "Found her on TikTok Live and immediately bought everything. Worth every penny.", name: "Tasha W." },
];

export default function SerifLuxe() {
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    <div style={{ background: t.BG, color: t.TEXT, fontFamily: INTER, minHeight: "100vh" }}>

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
          position: "fixed", top: isMobile ? 16 : 80, right: 16, zIndex: 100,
          background: dark ? "#FAF7F0" : "#0A0A08",
          color: dark ? "#0A0A08" : "#FAF7F0",
          border: "none", borderRadius: 50, padding: "8px 16px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          fontFamily: INTER,
        }}
      >
        {dark ? "☀ Light" : "☾ Dark"}
      </button>

      {/* Back button */}
      <a href="/" style={{
        position: "fixed", top: isMobile ? 16 : 80, left: 16, zIndex: 100,
        background: dark ? "#D4920A" : "#0A0A08",
        color: dark ? "#0A0A08" : "#FAF7F0",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)", fontFamily: INTER,
      }}>← All Designs</a>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${t.BG}F0`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${t.NAV_BORDER}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {!isMobile && ["Shop", "About", "Live", "Contact"].map((item) => (
              <a key={item} href={item === "About" ? "#about" : "#"} style={{ color: t.MUTED, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: INTER, fontWeight: 500 }}
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

      {/* Logo Band */}
      <div style={{ background: "#000000", display: "flex", justifyContent: "center", alignItems: "center", padding: isMobile ? "10px 0" : "20px 0 16px", borderBottom: `1px solid ${t.AMBER}55` }}>
        <a href="/"><img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: isMobile ? "72px" : "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: isMobile ? "80vh" : "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80"
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.2 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: t.BG, zIndex: 1, opacity: dark ? 0.78 : 0.88 }} />
        <div style={{ position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)", width: "55%", height: "90vh", background: `radial-gradient(ellipse at center, ${t.AMBER_GLOW}18 0%, ${t.AMBER}0A 45%, transparent 70%)`, borderRadius: "50%", zIndex: 2 }} />
        <div style={{ position: "absolute", right: "5%", top: "20%", width: isMobile ? 150 : 300, height: isMobile ? 150 : 300, background: `radial-gradient(circle, ${t.AMBER}12 0%, transparent 70%)`, borderRadius: "50%", zIndex: 2 }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 760, margin: "0 auto", padding: isMobile ? "80px 24px" : "120px 32px", width: "100%" }}>
          <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontFamily: INTER, fontWeight: 600 }}>
            Handcrafted · Las Vegas · Since 2026
          </p>
          <h1 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(54px, 7vw, 100px)", fontWeight: 400, lineHeight: 1.0, marginBottom: 32, color: t.TEXT, letterSpacing: "-0.01em" }}>
            Your Skin<br />
            <span style={{ color: t.AMBER, fontStyle: "italic" }}>Deserves</span><br />
            the Ritual
          </h1>
          <p style={{ color: t.MUTED, fontSize: isMobile ? 16 : 18, maxWidth: 480, lineHeight: 1.75, marginBottom: 52, fontFamily: INTER }}>
            Luxury body butters & oils made for women who invest in themselves.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#" style={{ background: t.AMBER, color: "#0A0A08", padding: "16px 44px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              Shop Now
            </a>
            <a href="#" style={{ border: `2px solid ${t.AMBER}`, color: t.AMBER, padding: "16px 44px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", background: "transparent" }}>
              Watch Us Live
            </a>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div style={{ background: t.AMBER, overflow: "hidden", padding: "14px 0", borderTop: `2px solid ${t.AMBER_GLOW}`, borderBottom: `2px solid ${t.AMBER_GLOW}` }}>
        <div style={{ display: "flex", width: "200%", animation: "marquee 22s linear infinite" }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ whiteSpace: "nowrap", flex: "0 0 50%", fontFamily: PLAYFAIR, fontSize: 18, fontStyle: "italic", color: "#0A0A08" }}>
              Whipped &nbsp;·&nbsp; Handmade &nbsp;·&nbsp; Skin Ritual &nbsp;·&nbsp; Nourish &nbsp;·&nbsp; Glow &nbsp;·&nbsp; Live Selling &nbsp;·&nbsp; Las Vegas &nbsp;·&nbsp; Elyxier &nbsp;·&nbsp; Whipped &nbsp;·&nbsp; Handmade &nbsp;·&nbsp; Skin Ritual &nbsp;·&nbsp; Nourish &nbsp;·&nbsp; Glow &nbsp;·&nbsp; Live Selling &nbsp;·&nbsp; Las Vegas &nbsp;·&nbsp; Elyxier &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Products */}
      <section style={{ padding: isMobile ? "64px 16px" : "120px 32px", background: t.BG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 16, fontFamily: INTER, fontWeight: 600 }}>Our Products</p>
            <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 400, letterSpacing: "-0.01em", color: t.TEXT }}>The Collection</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
            {products.map((p) => (
              <div key={p.name} style={{ background: t.CARD, display: "flex", flexDirection: "column", cursor: "pointer", border: `1px solid ${t.AMBER}20` }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${t.AMBER}66`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${t.AMBER}20`; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "relative", width: "100%", height: "220px", overflow: "hidden" }}>
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <span style={{ position: "absolute", top: 10, right: 10, color: t.AMBER, fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(0,0,0,0.5)", padding: "3px 10px" }}>Handcrafted</span>
                </div>
                <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: PLAYFAIR, fontSize: 20, fontWeight: 400, color: t.TEXT, marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16, fontFamily: INTER }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 20, fontStyle: "italic" }}>$25.00</span>
                    <button style={{ background: t.BTN_PRIMARY_BG, color: t.BTN_PRIMARY_TEXT, border: "none", padding: "8px 20px", fontFamily: INTER, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="about" style={{ background: t.STORY_BG, padding: isMobile ? "64px 16px" : "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 280, height: 280, borderRadius: "50%", background: t.STORY_E_BG, border: `2px solid ${t.AMBER}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: PLAYFAIR, fontSize: 160, fontStyle: "italic", fontWeight: 400, color: t.STORY_E_TEXT, lineHeight: 1, opacity: 0.9 }}>E</span>
              </div>
            </div>
          )}
          <div>
            <p style={{ color: t.AMBER, fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 20 }}>Our Story</p>
            <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 400, color: t.STORY_TEXT, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 28 }}>
              Made with Intention.<br /><span style={{ fontStyle: "italic", color: t.AMBER }}>Worn with Confidence.</span>
            </h2>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 24, fontFamily: INTER }}>
              ELYXIER was born from a simple truth: your skin deserves more. Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care isn&apos;t a trend — it&apos;s a ritual. Every whipped butter and nourishing oil in our collection is handcrafted with intention, using premium ingredients chosen to nourish, protect, and celebrate your skin.
            </p>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 24, fontFamily: INTER }}>
              What started as a personal obsession with finding products that actually worked became a passion for creating them. Data blends every formula herself, pouring care and craftsmanship into each jar so you receive something truly made with you in mind.
            </p>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 28, fontFamily: INTER }}>
              ELYXIER is designed for women who invest in themselves — women who know that how you treat your body is a reflection of how you see yourself. We proudly celebrate women of all backgrounds, all skin tones, and all sizes, because luxury should never have a limit.
            </p>
            <p style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 20, fontStyle: "italic", letterSpacing: "0.02em", marginBottom: 36 }}>
              &ldquo;Your skin. Your ritual. Your ELYXIER.&rdquo;
            </p>
            <a href="#" style={{ background: t.AMBER, color: "#0A0A08", padding: "14px 36px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              Meet the Maker
            </a>
          </div>
        </div>
      </section>

      {/* Live Selling CTA */}
      <section style={{ background: dark ? "#080806" : "#FAF7F0", padding: isMobile ? "64px 16px" : "100px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {dark && (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${t.AMBER}10 0%, transparent 65%)` }} />
        )}
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: t.AMBER, fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20 }}>Catch Us Live</p>
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 400, color: t.TEXT, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 28 }}>
            Shop With<br /><span style={{ color: t.AMBER, fontStyle: "italic" }}>Us Live</span>
          </h2>
          <p style={{ color: t.MUTED, fontSize: 17, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px", fontFamily: INTER }}>
            Join us on TikTok, Instagram, Facebook, and Whatnot for live selling events, product drops, and exclusive deals.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {["TikTok", "Instagram", "Facebook", "Whatnot"].map((p) => (
              <a key={p} href="#" style={{ background: t.BTN_PRIMARY_BG, color: t.BTN_PRIMARY_TEXT, padding: "12px 28px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", borderRadius: 2 }}>
                {p}
              </a>
            ))}
          </div>
          <p style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 18, fontStyle: "italic" }}>Follow @elyxier702 for live alerts</p>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: t.SECTION, padding: isMobile ? "64px 16px" : "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: t.AMBER, fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Real Reviews</p>
            <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 400, color: t.TEXT, letterSpacing: "-0.01em" }}>What They&apos;re Saying</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 28 }}>
            {testimonials.map((r) => (
              <div key={r.name} style={{ background: t.CARD, padding: "32px 28px", borderLeft: `3px solid ${t.AMBER}` }}>
                <p style={{ color: t.MUTED, fontSize: 15, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20, fontFamily: PLAYFAIR }}>
                  &ldquo;{r.quote}&rdquo;
                </p>
                <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: t.AMBER }}>— {r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section style={{ background: dark ? "#0A0A08" : t.AMBER, padding: isMobile ? "64px 16px" : "100px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ color: dark ? t.AMBER : "#0A0A08", fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20 }}>Exclusive Access</p>
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 400, color: dark ? t.TEXT : "#0A0A08", letterSpacing: "-0.01em", marginBottom: 16 }}>
            Join the Ritual
          </h2>
          <p style={{ color: dark ? t.MUTED : "#3A2800", fontSize: 16, lineHeight: 1.75, marginBottom: 44, fontFamily: INTER }}>
            Get early access to new drops, live event alerts, and exclusive offers.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}`, padding: "16px 24px", fontSize: 15, outline: "none", fontFamily: INTER, borderRadius: 2 }}
            />
            <button style={{ background: dark ? t.AMBER : "#0A0A08", color: dark ? "#0A0A08" : "#FAF7F0", border: "none", padding: "16px 0", fontFamily: INTER, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: t.FOOTER_BG, padding: isMobile ? "40px 16px" : "56px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
            <p style={{ color: "#6B6050", fontSize: 13, marginTop: 8, letterSpacing: "0.05em", fontFamily: INTER }}>
              Luxury Body Butters & Oils · Handcrafted in Las Vegas
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 28, flexWrap: "wrap", marginBottom: 32 }}>
            {["TikTok", "Instagram", "Facebook", "Whatnot", "Amazon"].map((s) => (
              <a key={s} href="#" style={{ color: "#6B6050", fontSize: 12, textDecoration: "none", letterSpacing: "0.08em", fontFamily: INTER, textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = "#6B6050")}>
                {s}
              </a>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1A1A14", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: INTER }}>© 2026 ELYXIER. All rights reserved.</p>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: INTER }}>Temperature-sensitive products. Ships with care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

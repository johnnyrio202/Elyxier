"use client";
import { useState, useEffect } from "react";

const products = [
  { name: "Bare Bliss", price: "$25", photo: "/bare-bliss.jpeg", blurb: "Pure, nourishing hydration without added scents. Made with organic shea butter, mango butter, and skin-loving oils that deeply moisturize and soften even the most sensitive skin. No fragrance. No unnecessary additives. Just pure hydration your skin will love." },
  { name: "Champagne Glow", price: "$25", photo: "/champagne-glow.jpeg", blurb: "A radiant body butter infused with soft shimmer and bubbly champagne notes with bright citrus accords. Shea and mango butter deliver deep hydration while a delicate shimmer leaves skin luminous and sun-kissed with every application." },
  { name: "Lilac Dreams", price: "$25", photo: "/lilac-dreams.jpeg", blurb: "A soothing blend of chamomile and soft lavender designed for your nighttime ritual. Rich shea and mango butter melt effortlessly into skin, leaving it silky smooth and beautifully nourished. Breathe it in, let go of the day, and drift into rest." },
  { name: "Pink Silk", price: "$25", photo: "/pink-silk.jpeg", blurb: "A sweet, feminine blend of juicy fruits, sparkling citrus, soft florals, and warm vanilla. This rich, creamy formula melts into skin for lasting moisture without greasiness — leaving behind a silky, irresistible scent that is both playful and elegant." },
];

export default function WarmIvory() {
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
          position: "fixed", top: isMobile ? 16 : 80, right: 16, zIndex: 100,
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
        position: "fixed", top: isMobile ? 16 : 80, left: 16, zIndex: 100,
        background: "#FAF7F2", color: "#2A1810", border: "1px solid #CC8800",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>← All Designs</a>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: `${IVORY}F0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${AMBER}22` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {!isMobile && ["Shop", "About", "Live"].map((item) => (
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

      {/* Logo Band */}
      <div style={{ background: "#000000", display: "flex", justifyContent: "center", alignItems: "center", padding: isMobile ? "10px 0" : "20px 0 16px", borderBottom: `2px solid ${AMBER}` }}>
        <a href="/"><img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: isMobile ? "72px" : "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80"
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.15 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${IVORY} 0%, ${BLUSH} 100%)`, zIndex: 1, opacity: 0.92 }} />
        <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "44%", height: "80vh", background: `radial-gradient(ellipse, ${AMBER}26 0%, ${AMBER}10 40%, transparent 80%)`, borderRadius: "50% 0 0 50%", opacity: dark ? 0.3 : 0.15, zIndex: 2 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "80px 24px" : "80px 40px", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : 64, alignItems: "center", position: "relative", zIndex: 3 }}>
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
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 380, height: 480, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #FFF0C0 0%, #E8B84B 35%, #CC8800 60%, #8B5500 85%, #3D2800 100%)", overflow: "hidden" }} />
                <div style={{ position: "absolute", bottom: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: BLUSH, border: `3px solid ${AMBER}44` }} />
                <div style={{ position: "absolute", top: -10, left: -20, width: 80, height: 80, borderRadius: "50%", background: BLUSH, border: `2px solid ${AMBER}33` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section style={{ background: BLUSH, padding: isMobile ? "64px 16px" : "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Our Products</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 400, color: CHOC }}>Made for Your Skin</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
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
                    borderRadius: 20,
                    boxShadow: dark ? "0 2px 20px #00000030" : "0 2px 20px #00000010",
                  }}>
                    <div style={{ height: "72%", overflow: "hidden" }}>
                      <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ padding: "16px 20px 12px" }}>
                      <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 500, color: CHOC, marginBottom: 6 }}>{p.name}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 600, color: AMBER }}>{p.price}</span>
                        <span style={{ color: TEXT_LIGHT, fontSize: 10, letterSpacing: "0.15em" }}>✦ DISCOVER</span>
                      </div>
                    </div>
                  </div>
                  {/* BACK */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    WebkitBackfaceVisibility: "hidden" as const,
                    transform: "rotateY(180deg)",
                    background: dark ? "#3A2210" : "#FFF8EE",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    padding: "28px 24px",
                    borderRadius: 20,
                    boxShadow: dark ? "0 2px 20px #00000030" : "0 2px 20px #00000010",
                  }}>
                    <p style={{ color: AMBER, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, marginBottom: 10 }}>The Blend</p>
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 500, color: CHOC, marginBottom: 14 }}>{p.name}</h3>
                    <p style={{ color: TEXT_LIGHT, fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 20 }}>{p.blurb}</p>
                    <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 600, color: AMBER, display: "block", marginBottom: 16 }}>{p.price}</span>
                    <button
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: `linear-gradient(135deg, ${AMBER}, ${dark ? "#EAB030" : "#E09A1A"})`,
                        color: "#FFFFFF",
                        border: "none",
                        padding: "15px 0",
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase" as const,
                        fontWeight: 700,
                        cursor: "pointer",
                        borderRadius: 50,
                        boxShadow: `0 4px 20px ${AMBER}50`,
                        fontFamily: "var(--font-dm-sans), sans-serif",
                      }}
                    >
                      Add to Ritual ✦
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: isMobile ? "64px 16px" : "120px 40px", background: IVORY }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 340, height: 420, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(160deg, #FFF0C0 0%, #E8B84B 30%, #CC8800 60%, #8B5500 100%)" }} />
                <div style={{ position: "absolute", bottom: -24, right: -24, width: 140, height: 140, borderRadius: "50%", background: BLUSH, border: `3px solid ${AMBER}` }} />
              </div>
            </div>
          )}
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
      <section style={{ background: `linear-gradient(135deg, #CC7700, #E8A030)`, padding: isMobile ? "48px 16px" : "80px 40px" }}>
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

      {/* Community */}
      <section style={{ background: IVORY, padding: isMobile ? "64px 16px" : "120px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: `${AMBER}18`, border: `1px solid ${AMBER}44`, color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" as const, padding: "6px 20px", borderRadius: 50, marginBottom: 24 }}>Join the Inner Circle</span>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 400, color: CHOC, marginBottom: 16, lineHeight: 1.2 }}>Your Backstage Pass to ELYXIER</h2>
          <p style={{ color: TEXT_LIGHT, fontSize: 16, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px" }}>
            This isn&apos;t just a newsletter — it&apos;s your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
              { title: "✦ Beauty Tips & Rituals", body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself." },
              { title: "✦ Subscriber-Only Access", body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions." },
              { title: "✦ First at the Drop", body: "Priority access to limited product releases before they go public. Never miss a drop." },
            ].map((b) => (
              <div key={b.title} style={{ background: BLUSH, borderRadius: 16, padding: "24px 20px", textAlign: "left", border: `1px solid ${AMBER}22` }}>
                <p style={{ color: AMBER, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{b.title}</p>
                <p style={{ color: TEXT_LIGHT, fontSize: 13, lineHeight: 1.7 }}>{b.body}</p>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 12 }}>
            <input type="text" placeholder="Full Name" style={{ background: "#FFF", border: `1.5px solid ${AMBER}44`, borderRadius: 50, padding: "14px 24px", fontSize: 15, outline: "none", color: CHOC, fontFamily: "var(--font-dm-sans), sans-serif" }} />
            <input type="email" placeholder="Email Address" style={{ background: "#FFF", border: `1.5px solid ${AMBER}44`, borderRadius: 50, padding: "14px 24px", fontSize: 15, outline: "none", color: CHOC, fontFamily: "var(--font-dm-sans), sans-serif" }} />
            <input type="tel" placeholder="Phone Number" style={{ background: "#FFF", border: `1.5px solid ${AMBER}44`, borderRadius: 50, padding: "14px 24px", fontSize: 15, outline: "none", color: CHOC, fontFamily: "var(--font-dm-sans), sans-serif" }} />
            <button style={{ background: `linear-gradient(135deg, ${AMBER}, ${dark ? "#EAB030" : "#E09A1A"})`, color: "#FFF", border: "none", borderRadius: 50, padding: "16px 0", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: `0 4px 24px ${AMBER}40`, marginTop: 4 }}>
              Join the Circle
            </button>
            <p style={{ color: `${TEXT_LIGHT}88`, fontSize: 12, marginTop: 4 }}>No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${AMBER}22`, padding: isMobile ? "32px 16px" : "48px 40px", background: FOOTER_BG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
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

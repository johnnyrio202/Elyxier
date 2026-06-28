"use client";
import { useState, useEffect } from "react";

const products = [
  { name: "Bare Bliss", price: "$25", photos: ["/bare-bliss-hero.jpeg", "/bare-bliss-swirl.jpeg"], blurb: "Pure, nourishing hydration without added scents. Made with organic shea butter, mango butter, and skin-loving oils that deeply moisturize and soften even the most sensitive skin. No fragrance. No unnecessary additives. Just pure hydration your skin will love." },
  { name: "Champagne Glow", price: "$25", photos: ["/champagne-glow-hero.jpeg", "/champagne-glow-swirl.jpeg"], blurb: "A radiant body butter infused with soft shimmer and bubbly champagne notes with bright citrus accords. Shea and mango butter deliver deep hydration while a delicate shimmer leaves skin luminous and sun-kissed with every application." },
  { name: "Lilac Dreams", price: "$25", photos: ["/lilac-dreams-hero.jpeg", "/lilac-dreams-swirl.jpeg"], blurb: "A soothing blend of chamomile and soft lavender designed for your nighttime ritual. Rich shea and mango butter melt effortlessly into skin, leaving it silky smooth and beautifully nourished. Breathe it in, let go of the day, and drift into rest." },
  { name: "Pink Silk", price: "$25", photos: ["/pink-silk-hero.jpeg", "/pink-silk-swirl.jpeg"], blurb: "A sweet, feminine blend of juicy fruits, sparkling citrus, soft florals, and warm vanilla. This rich, creamy formula melts into skin for lasting moisture without greasiness — leaving behind a silky, irresistible scent that is both playful and elegant." },
];

export default function BoldCanvas() {
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const intervals = products
      .filter(p => p.photos.length > 1)
      .map(p => setInterval(() => {
        setActivePhotoIdx(prev => ({
          ...prev,
          [p.name]: ((prev[p.name] ?? 0) + 1) % p.photos.length,
        }));
      }, 3000));
    return () => intervals.forEach(clearInterval);
  }, []);

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
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Dark/Light Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed", top: isMobile ? 16 : 80, right: 16, zIndex: 100,
          background: dark ? "#F5F0FF" : "#0D0010",
          color: dark ? "#0D0010" : "#F5F0FF",
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
        background: "#4A1259", color: "#FFFFFF",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>← All Designs</a>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: WHITE, borderBottom: `3px solid ${NAV_BORDER}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {!isMobile && ["Shop", "About", "Live"].map((item) => (
              <a key={item} href={item === "About" ? "#about" : "#"} style={{ color: TEXT_DARK, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 600 }}
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

      {/* Logo Band */}
      <div style={{ background: "#000000", display: "flex", justifyContent: "center", alignItems: "center", padding: isMobile ? "10px 0" : "20px 0 16px", borderBottom: `3px solid ${PLUM}` }}>
        <a href="/"><img src="/elyxier-logo-plum.png" alt="ELYXIER" style={{ height: isMobile ? "72px" : "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ minHeight: isMobile ? "auto" : "95vh", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", overflow: "hidden" }}>
        <div style={{ background: PLUM, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "72px 24px 64px" : "80px 60px", minHeight: isMobile ? "80vh" : "auto" }}>
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
        {!isMobile && (
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=900&h=900&fit=crop&q=80"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "95vh" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(122,26,155,0.65) 0%, rgba(196,30,58,0.5) 60%, rgba(212,160,160,0.3) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ marginTop: 20, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "8px 24px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
                <span style={{ color: WHITE, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>NEW DROP</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Products */}
      <section style={{ padding: isMobile ? "64px 16px" : "100px 40px", background: LIGHT_PLUM }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, gap: 16 }}>
            <div>
              <p style={{ color: PLUM, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>Our Products</p>
              <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: TEXT_DARK, textTransform: "uppercase", letterSpacing: "-0.01em" }}>THE COLLECTION</h2>
            </div>
            <a href="#" style={{ color: PLUM, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `2px solid ${PLUM}`, paddingBottom: 2, fontFamily: "var(--font-montserrat), sans-serif" }}>
              View All →
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
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
                    background: CARD_BG, overflow: "hidden",
                    borderRadius: 8,
                    boxShadow: `0 2px 12px rgba(74,18,89,${dark ? "0.25" : "0.08"})`,
                  }}>
                    <div style={{ height: "72%", overflow: "hidden", position: "relative" }}>
                      <img key={p.photos[activePhotoIdx[p.name] ?? 0]} src={p.photos[activePhotoIdx[p.name] ?? 0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 0.9s ease-in-out" }} />
                      {p.photos.length > 1 && (
                        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 2 }}>
                          {p.photos.map((_, idx) => (
                            <div
                              key={idx}
                              style={{ width: 6, height: 6, borderRadius: "50%", background: (activePhotoIdx[p.name] ?? 0) === idx ? "#fff" : "rgba(255,255,255,0.45)", transition: "background 0.4s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "16px 20px 12px" }}>
                      <h3 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 14, fontWeight: 800, color: PLUM, textTransform: "uppercase" as const, letterSpacing: "0.04em", marginBottom: 6 }}>{p.name}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: ROSE, color: WHITE, fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 50, fontFamily: "var(--font-montserrat), sans-serif" }}>{p.price}</span>
                        <span style={{ color: TEXT_MID, fontSize: 10, letterSpacing: "0.15em" }}>✦ DISCOVER</span>
                      </div>
                    </div>
                  </div>
                  {/* BACK */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    WebkitBackfaceVisibility: "hidden" as const,
                    transform: "rotateY(180deg)",
                    background: dark ? "#280038" : "#F0E0F8",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    padding: "28px 24px",
                    borderRadius: 8,
                    boxShadow: `0 2px 12px rgba(74,18,89,${dark ? "0.25" : "0.08"})`,
                  }}>
                    <p style={{ color: PLUM, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, marginBottom: 10 }}>The Blend</p>
                    <h3 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 14, fontWeight: 800, color: dark ? TEXT_DARK : PLUM, textTransform: "uppercase" as const, letterSpacing: "0.04em", marginBottom: 14 }}>{p.name}</h3>
                    <p style={{ color: TEXT_MID, fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 20 }}>{p.blurb}</p>
                    <span style={{ background: ROSE, color: WHITE, fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 50, display: "inline-block", marginBottom: 16, fontFamily: "var(--font-montserrat), sans-serif" }}>{p.price}</span>
                    <button
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: `linear-gradient(135deg, ${PLUM}, ${RED})`,
                        color: "#FFFFFF",
                        border: "none",
                        padding: "15px 0",
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase" as const,
                        fontWeight: 700,
                        cursor: "pointer",
                        borderRadius: 4,
                        boxShadow: `0 4px 20px ${PLUM}50`,
                        fontFamily: "var(--font-montserrat), sans-serif",
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
      <section id="about" style={{ background: PLUM, padding: isMobile ? "64px 16px" : "120px 40px", textAlign: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(196,30,58,0.15)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(212,160,160,0.1)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <p style={{ color: ROSE, fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: 24, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>About ELYXIER</p>
          <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", lineHeight: 1.05, marginBottom: 40, letterSpacing: "-0.02em" }}>
            THE STORY BEHIND<br />THE BUTTER.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 24px", fontFamily: "var(--font-nunito), sans-serif" }}>
            Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care is a ritual, not a trend. Every body butter and oil is handcrafted by hand using premium ingredients chosen to nourish, protect, and celebrate your skin.
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, lineHeight: 1.9, maxWidth: 620, margin: "0 auto 16px", fontFamily: "var(--font-nunito), sans-serif" }}>
            We believe luxury should never have a limit — ELYXIER is made for women of all backgrounds who invest in themselves.
          </p>
          <p style={{ color: ROSE, fontSize: 17, fontStyle: "italic", marginBottom: 48, fontFamily: "var(--font-nunito), sans-serif" }}>
            Your skin. Your ritual. Your ELYXIER.
          </p>
          <a href="#" style={{ background: ROSE, color: "#FFFFFF", padding: "16px 48px", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800, borderRadius: 4, fontFamily: "var(--font-montserrat), sans-serif", display: "inline-block" }}>
            Our Full Story
          </a>
        </div>
      </section>

      {/* Live Shopping */}
      <section style={{ background: `linear-gradient(90deg, ${RED} 0%, ${PLUM} 100%)`, padding: isMobile ? "48px 16px" : "80px 40px" }}>
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

      {/* Community */}
      <section style={{ background: PLUM, padding: isMobile ? "64px 16px" : "100px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: ROSE, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase" as const, padding: "6px 18px", borderRadius: 4, marginBottom: 24, fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 700 }}>Join the Inner Circle</span>
          <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase" as const, marginBottom: 16, letterSpacing: "-0.01em" }}>Your Backstage Pass to ELYXIER</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px", fontFamily: "var(--font-nunito), sans-serif" }}>
            This isn&apos;t just a newsletter — it&apos;s your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
              { title: "✦ Beauty Tips & Rituals", body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself." },
              { title: "✦ Subscriber-Only Access", body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions." },
              { title: "✦ First at the Drop", body: "Priority access to limited product releases before they go public. Never miss a drop." },
            ].map((b) => (
              <div key={b.title} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "24px 20px", textAlign: "left", border: "1px solid rgba(255,255,255,0.15)" }}>
                <p style={{ color: ROSE, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-montserrat), sans-serif", marginBottom: 10 }}>{b.title}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7, fontFamily: "var(--font-nunito), sans-serif" }}>{b.body}</p>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 12 }}>
            <input type="text" placeholder="Full Name" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "#FFFFFF", fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-nunito), sans-serif" }} />
            <input type="email" placeholder="Email Address" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "#FFFFFF", fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-nunito), sans-serif" }} />
            <input type="tel" placeholder="Phone Number" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "#FFFFFF", fontSize: 15, padding: "14px 18px", outline: "none", fontFamily: "var(--font-nunito), sans-serif" }} />
            <button style={{ background: `linear-gradient(135deg, ${RED}, ${PLUM})`, color: "#FFFFFF", border: "none", padding: "16px 0", fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 800, cursor: "pointer", borderRadius: 4, fontFamily: "var(--font-montserrat), sans-serif", boxShadow: `0 4px 24px ${RED}50`, marginTop: 4 }}>
              Join the Circle
            </button>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: TEXT_DARK, padding: isMobile ? "32px 16px" : "48px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <img src="/elyxier-logo-plum.png" alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
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

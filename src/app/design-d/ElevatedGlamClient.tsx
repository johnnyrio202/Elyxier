"use client";
import { useState, useEffect } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { UserButton, useUser } from "@clerk/nextjs";

const BEBAS = "var(--font-bebas), Impact, sans-serif";
const DM = "var(--font-dm-sans), system-ui, sans-serif";

const testimonials = [
  { quote: "This body butter changed my entire routine. My skin has never felt so soft!", name: "Jasmine T." },
  { quote: "I bought the Lavender & Honey and I'm obsessed. Already ordered 3 more!", name: "Monique R." },
  { quote: "Found her on TikTok Live and immediately bought everything. Worth every penny.", name: "Tasha W." },
];

function resolveImage(image: unknown, width: number): string {
  try {
    return urlFor(image as SanityImageSource).width(width).url();
  } catch {
    return "";
  }
}

export default function ElevatedGlam({ products }: { products: CatalogProduct[] }) {
  const { isSignedIn, isLoaded } = useUser();
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [key: string]: number }>({});
  const [cart, setCart] = useState<{ [slug: string]: number }>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle");
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [leadState, setLeadState] = useState<"idle" | "loading" | "done" | "error">("idle");

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
          [p.slug]: ((prev[p.slug] ?? 0) + 1) % p.photos.length,
        }));
      }, 5000));
    return () => intervals.forEach(clearInterval);
  }, [products]);

  function addToCart(slug: string) {
    setCart(prev => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 }));
    setCartOpen(true);
  }

  function removeFromCart(slug: string) {
    setCart(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }

  const cartItems = Object.entries(cart)
    .map(([slug, quantity]) => ({ product: products.find(p => p.slug === slug), quantity }))
    .filter((i): i is { product: CatalogProduct; quantity: number } => !!i.product);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotalCents = cartItems.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);

  async function checkout() {
    setCheckoutState("loading");
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(i => ({ slug: i.product.slug, quantity: i.quantity })),
          source: "design-d",
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.error ?? "Could not create order");

      const checkoutRes = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.order.id }),
      });
      const checkoutJson = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutJson.error ?? "Could not start checkout");

      window.location.href = checkoutJson.url;
    } catch {
      setCheckoutState("error");
    }
  }

  async function joinCircle() {
    if (!lead.email) return;
    setLeadState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "design-d" }),
      });
      if (!res.ok) throw new Error();
      setLeadState("done");
    } catch {
      setLeadState("error");
    }
  }

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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
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
          fontFamily: DM,
        }}
      >
        {dark ? "☀ LIGHT" : "☾ DARK"}
      </button>

      {/* Back button */}
      <a href="/" style={{
        position: "fixed", top: isMobile ? 16 : 80, left: 16, zIndex: 100,
        background: dark ? "#D4920A" : "#0A0A08",
        color: dark ? "#0A0A08" : "#FAF7F0",
        padding: "8px 16px", borderRadius: "999px",
        fontSize: "12px", fontWeight: 700, letterSpacing: "1px",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)", fontFamily: DM,
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
              <a key={item} href={item === "About" ? "#about" : "#"} style={{ color: t.MUTED, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: DM, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = t.MUTED)}>
                {item}
              </a>
            ))}
            <button onClick={() => setCartOpen(true)} style={{ color: t.TEXT, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", position: "relative", padding: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -8, right: -10, background: t.AMBER, color: "#0A0A08", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DM }}>
                  {cartCount}
                </span>
              )}
            </button>
            {isLoaded && (isSignedIn ? (
              <a href="/account" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <UserButton />
              </a>
            ) : (
              <a href="/sign-in" style={{ color: t.MUTED, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: DM, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = t.MUTED)}>
                Sign In
              </a>
            ))}
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
          <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontFamily: DM, fontWeight: 600 }}>
            HANDCRAFTED · LAS VEGAS · SINCE 2026
          </p>
          <h1 style={{ fontFamily: BEBAS, fontSize: "clamp(64px, 9vw, 130px)", lineHeight: 0.95, marginBottom: 32, color: t.TEXT, letterSpacing: "0.04em" }}>
            YOUR SKIN<br />
            <span style={{ color: t.AMBER }}>DESERVES</span><br />
            THE RITUAL
          </h1>
          <p style={{ color: t.MUTED, fontSize: isMobile ? 16 : 18, maxWidth: 480, lineHeight: 1.75, marginBottom: 52, fontFamily: DM }}>
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
      <section style={{ padding: isMobile ? "64px 16px" : "120px 32px", background: t.BG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 16, fontFamily: DM, fontWeight: 600 }}>Our Products</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: "0.06em", color: t.TEXT }}>THE COLLECTION</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
            {products.map((p) => {
              const photoUrls = p.photos.map((photo) => resolveImage(photo, 600));
              const priceLabel = `$${(p.priceCents / 100).toFixed(2)}`;
              return (
              <div
                key={p.slug}
                style={{ perspective: "1000px", height: isMobile ? "320px" : "380px", cursor: "pointer" }}
                onMouseEnter={() => !isMobile && setFlippedCard(p.slug)}
                onMouseLeave={() => !isMobile && setFlippedCard(null)}
                onClick={() => setFlippedCard(flippedCard === p.slug ? null : p.slug)}
              >
                <div style={{
                  position: "relative", width: "100%", height: "100%",
                  transformStyle: "preserve-3d" as const,
                  transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: flippedCard === p.slug ? "rotateY(180deg)" : "rotateY(0deg)",
                }}>
                  {/* FRONT */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    WebkitBackfaceVisibility: "hidden" as const,
                    background: t.CARD, overflow: "hidden",
                    border: `1px solid ${t.AMBER}20`,
                  }}>
                    <div style={{ height: "72%", overflow: "hidden", position: "relative" }}>
                      <img key={photoUrls[activePhotoIdx[p.slug] ?? 0]} src={photoUrls[activePhotoIdx[p.slug] ?? 0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 1.4s ease-in-out" }} />
                      {!p.inStock && (
                        <span style={{ position: "absolute", top: 10, left: 10, background: "#0A0A08", color: "#FAF7F0", fontSize: 10, letterSpacing: "0.15em", padding: "4px 10px", fontFamily: DM, fontWeight: 700 }}>SOLD OUT</span>
                      )}
                      {photoUrls.length > 1 && (
                        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 2 }}>
                          {photoUrls.map((_, idx) => (
                            <div
                              key={idx}
                              style={{ width: 6, height: 6, borderRadius: "50%", background: (activePhotoIdx[p.slug] ?? 0) === idx ? "#fff" : "rgba(255,255,255,0.45)", transition: "background 0.4s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "16px 20px 12px" }}>
                      <h3 style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: "0.06em", color: t.TEXT, marginBottom: 6 }}>{p.name}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.05em" }}>{priceLabel}</span>
                        <span style={{ color: t.MUTED, fontSize: 10, letterSpacing: "0.15em" }}>✦ DISCOVER</span>
                      </div>
                    </div>
                  </div>
                  {/* BACK */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    WebkitBackfaceVisibility: "hidden" as const,
                    transform: "rotateY(180deg)",
                    background: dark ? "#1A1408" : "#FFF4E0",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    padding: "28px 24px",
                    border: `1px solid ${t.AMBER}20`,
                  }}>
                    <p style={{ color: t.AMBER, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, marginBottom: 10, fontFamily: DM }}>The Blend</p>
                    <h3 style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: "0.06em", color: t.TEXT, marginBottom: 14 }}>{p.name}</h3>
                    <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 20, fontFamily: DM }}>{p.blurb}</p>
                    <span style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.05em", display: "block", marginBottom: 16 }}>{priceLabel}</span>
                    <button
                      disabled={!p.inStock}
                      onClick={e => { e.stopPropagation(); addToCart(p.slug); }}
                      style={{
                        background: p.inStock ? `linear-gradient(135deg, ${t.AMBER}, ${dark ? "#E8A820" : "#D4920A"})` : t.MUTED,
                        color: "#0A0A08",
                        border: "none",
                        padding: "15px 0",
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase" as const,
                        fontWeight: 700,
                        cursor: p.inStock ? "pointer" : "not-allowed",
                        boxShadow: p.inStock ? `0 4px 20px ${t.AMBER}50` : "none",
                        fontFamily: BEBAS,
                      }}
                    >
                      {p.inStock ? "ADD TO RITUAL ✦" : "SOLD OUT"}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="about" style={{ background: t.STORY_BG, padding: isMobile ? "64px 16px" : "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 280, height: 280, borderRadius: "50%", background: t.STORY_E_BG, border: `2px solid ${t.AMBER}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: BEBAS, fontSize: 160, color: t.STORY_E_TEXT, lineHeight: 1, opacity: 0.9 }}>E</span>
              </div>
            </div>
          )}
          <div>
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.35em", marginBottom: 20 }}>OUR STORY</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(36px, 4.5vw, 60px)", color: t.STORY_TEXT, lineHeight: 1.05, letterSpacing: "0.04em", marginBottom: 28 }}>
              MADE WITH INTENTION.<br />WORN WITH CONFIDENCE.
            </h2>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 24, fontFamily: DM }}>
              ELYXIER was born from a simple truth: your skin deserves more. Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care isn&apos;t a trend — it&apos;s a ritual. Every whipped butter and nourishing oil in our collection is handcrafted with intention, using premium ingredients chosen to nourish, protect, and celebrate your skin.
            </p>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 24, fontFamily: DM }}>
              What started as a personal obsession with finding products that actually worked became a passion for creating them. Data blends every formula herself, pouring care and craftsmanship into each jar so you receive something truly made with you in mind.
            </p>
            <p style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: 28, fontFamily: DM }}>
              ELYXIER is designed for women who invest in themselves — women who know that how you treat your body is a reflection of how you see yourself. We proudly celebrate women of all backgrounds, all skin tones, and all sizes, because luxury should never have a limit.
            </p>
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.1em", marginBottom: 36 }}>
              YOUR SKIN. YOUR RITUAL. YOUR ELYXIER.
            </p>
            <a href="#" style={{ background: t.AMBER, color: "#0A0A08", padding: "14px 36px", fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.12em", textDecoration: "none", display: "inline-block" }}>
              MEET THE MAKER
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
      <section style={{ background: t.SECTION, padding: isMobile ? "64px 16px" : "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 13, letterSpacing: "0.4em", marginBottom: 16 }}>REAL REVIEWS</p>
            <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(40px, 5vw, 64px)", color: t.TEXT, letterSpacing: "0.05em" }}>WHAT THEY&apos;RE SAYING</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 28 }}>
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

      {/* Community */}
      <section style={{ background: dark ? "#0A0A08" : "#FFF8ED", padding: isMobile ? "64px 16px" : "100px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: `${t.AMBER}22`, border: `1px solid ${t.AMBER}55`, color: t.AMBER, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase" as const, padding: "6px 18px", marginBottom: 24, fontFamily: BEBAS }}>JOIN THE INNER CIRCLE</span>
          <h2 style={{ fontFamily: BEBAS, fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "0.04em", color: t.TEXT, marginBottom: 16 }}>YOUR BACKSTAGE PASS TO ELYXIER</h2>
          <p style={{ color: t.MUTED, fontSize: 16, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px", fontFamily: DM }}>
            This isn&apos;t just a newsletter — it&apos;s your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
              { title: "✦ BEAUTY TIPS & RITUALS", body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself." },
              { title: "✦ SUBSCRIBER-ONLY ACCESS", body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions." },
              { title: "✦ FIRST AT THE DROP", body: "Priority access to limited product releases before they go public. Never miss a drop." },
            ].map((b) => (
              <div key={b.title} style={{ background: dark ? "#141410" : "#FFFFFF", border: `1px solid ${t.AMBER}22`, padding: "24px 20px", textAlign: "left" }}>
                <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 14, letterSpacing: "0.08em", marginBottom: 10 }}>{b.title}</p>
                <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.7, fontFamily: DM }}>{b.body}</p>
              </div>
            ))}
          </div>
          {leadState === "done" ? (
            <p style={{ color: t.AMBER, fontFamily: BEBAS, fontSize: 22, letterSpacing: "0.08em" }}>YOU&apos;RE IN ✦ WELCOME TO THE CIRCLE</p>
          ) : (
            <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 12 }}>
              <input type="text" placeholder="Full Name" value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: DM, borderRadius: 2 }} />
              <input type="email" placeholder="Email Address" value={lead.email} onChange={e => setLead(l => ({ ...l, email: e.target.value }))} style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: DM, borderRadius: 2 }} />
              <input type="tel" placeholder="Phone Number" value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: DM, borderRadius: 2 }} />
              <button onClick={joinCircle} disabled={!lead.email || leadState === "loading"} style={{ background: `linear-gradient(135deg, ${t.AMBER}, ${dark ? "#E8A820" : "#D4920A"})`, color: "#0A0A08", border: "none", padding: "16px 0", fontFamily: BEBAS, fontSize: 20, letterSpacing: "0.2em", cursor: !lead.email ? "not-allowed" : "pointer", boxShadow: `0 4px 24px ${t.AMBER}40`, marginTop: 4, opacity: leadState === "loading" ? 0.6 : 1 }}>
                {leadState === "loading" ? "JOINING..." : "JOIN THE CIRCLE"}
              </button>
              {leadState === "error" && <p style={{ color: "#D45A5A", fontSize: 12, fontFamily: DM }}>Something went wrong — try again.</p>}
              <p style={{ color: `${t.MUTED}88`, fontSize: 12, marginTop: 4, fontFamily: DM }}>No spam. Ever. Unsubscribe anytime.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: t.FOOTER_BG, padding: isMobile ? "40px 16px" : "56px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/elyxier-logo.png" alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
            <p style={{ color: "#6B6050", fontSize: 13, marginTop: 8, letterSpacing: "0.1em", fontFamily: DM }}>
              Luxury Body Butters & Oils · Handcrafted in Las Vegas
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 28, flexWrap: "wrap", marginBottom: 32 }}>
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

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: isMobile ? "100%" : 400, zIndex: 201,
            background: t.CARD, borderLeft: `1px solid ${t.AMBER}33`, display: "flex", flexDirection: "column" as const,
            padding: 24, overflowY: "auto" as const,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: "0.06em", color: t.TEXT }}>YOUR RITUAL</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: t.MUTED, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {cartItems.length === 0 ? (
              <p style={{ color: t.MUTED, fontFamily: DM, fontSize: 14 }}>Your cart is empty. Add a product to get started.</p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: 24, flex: 1 }}>
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.AMBER}22`, paddingBottom: 12 }}>
                      <div>
                        <p style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: "0.04em", color: t.TEXT }}>{product.name}</p>
                        <p style={{ fontFamily: DM, fontSize: 12, color: t.MUTED }}>Qty {quantity} · ${(product.priceCents / 100).toFixed(2)} each</p>
                      </div>
                      <button onClick={() => removeFromCart(product.slug)} style={{ background: "none", border: "none", color: t.MUTED, fontSize: 12, cursor: "pointer", textDecoration: "underline", fontFamily: DM }}>Remove</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontFamily: BEBAS, fontSize: 18, color: t.TEXT }}>TOTAL</span>
                  <span style={{ fontFamily: BEBAS, fontSize: 18, color: t.AMBER }}>${(cartTotalCents / 100).toFixed(2)}</span>
                </div>
                <button
                  onClick={checkout}
                  disabled={checkoutState === "loading"}
                  style={{
                    background: `linear-gradient(135deg, ${t.AMBER}, ${dark ? "#E8A820" : "#D4920A"})`,
                    color: "#0A0A08", border: "none", padding: "16px 0", fontFamily: BEBAS, fontSize: 18,
                    letterSpacing: "0.15em", cursor: "pointer", opacity: checkoutState === "loading" ? 0.6 : 1,
                  }}
                >
                  {checkoutState === "loading" ? "REDIRECTING..." : "CHECKOUT WITH STRIPE"}
                </button>
                {checkoutState === "error" && <p style={{ color: "#D45A5A", fontSize: 12, fontFamily: DM, marginTop: 8 }}>Checkout failed — please try again.</p>}
                <p style={{ color: `${t.MUTED}88`, fontSize: 11, marginTop: 12, fontFamily: DM }}>Test mode — no real charge will be made.</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/image";
import type { DesignEContent } from "@/sanity/queries";

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

type HeadlineLine = { text: string; emphasis?: boolean };
type Link = { label: string; href: string };

const FALLBACK = {
  navLinks: [
    { label: "Shop", href: "#" },
    { label: "About", href: "#about" },
    { label: "Live", href: "#" },
    { label: "Contact", href: "#" },
  ] as Link[],
  logo: "/elyxier-logo.png",
  footerTagline: "Luxury Body Butters & Oils · Handcrafted in Las Vegas",
  footerNote: "Temperature-sensitive products. Ships with care.",
  copyrightText: "© 2026 ELYXIER. All rights reserved.",
  socialLinks: [
    { platform: "TikTok", href: "#" },
    { platform: "Instagram", href: "#" },
    { platform: "Facebook", href: "#" },
    { platform: "Whatnot", href: "#" },
    { platform: "Amazon", href: "#" },
  ] as { platform: string; href: string }[],

  heroEyebrow: "Handcrafted · Las Vegas · Since 2026",
  heroHeadline: [
    { text: "Your Skin" },
    { text: "Deserves", emphasis: true },
    { text: "the Ritual" },
  ] as HeadlineLine[],
  heroSubhead: "Luxury body butters & oils made for women who invest in themselves.",
  heroBackground:
    "https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80",
  heroCtas: [
    { label: "Shop Now", href: "#" },
    { label: "Watch Us Live", href: "#" },
  ] as Link[],

  marqueePhrases: [
    "Whipped",
    "Handmade",
    "Skin Ritual",
    "Nourish",
    "Glow",
    "Live Selling",
    "Las Vegas",
    "Elyxier",
  ],

  storyEyebrow: "Our Story",
  storyHeadline: [
    { text: "Made with Intention." },
    { text: "Worn with Confidence.", emphasis: true },
  ] as HeadlineLine[],
  storyParagraphs: [
    "ELYXIER was born from a simple truth: your skin deserves more. Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care isn't a trend — it's a ritual. Every whipped butter and nourishing oil in our collection is handcrafted with intention, using premium ingredients chosen to nourish, protect, and celebrate your skin.",
    "What started as a personal obsession with finding products that actually worked became a passion for creating them. Data blends every formula herself, pouring care and craftsmanship into each jar so you receive something truly made with you in mind.",
    "ELYXIER is designed for women who invest in themselves — women who know that how you treat your body is a reflection of how you see yourself. We proudly celebrate women of all backgrounds, all skin tones, and all sizes, because luxury should never have a limit.",
  ],
  storyPullQuote: "Your skin. Your ritual. Your ELYXIER.",
  storyCtaLabel: "Meet the Maker",
  storyCtaHref: "#",

  liveSellingEyebrow: "Catch Us Live",
  liveSellingHeadline: [
    { text: "Shop With" },
    { text: "Us Live", emphasis: true },
  ] as HeadlineLine[],
  liveSellingBody:
    "Join us on TikTok, Instagram, Facebook, and Whatnot for live selling events, product drops, and exclusive deals.",
  liveSellingChannels: [
    { label: "TikTok", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Whatnot", href: "#" },
  ] as Link[],
  liveSellingFooterLine: "Follow @elyxier702 for live alerts",

  communityBadge: "Join the Inner Circle",
  communityHeadline: "Your Backstage Pass to ELYXIER",
  communityBody:
    "This isn't just a newsletter — it's your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.",
  communityBenefits: [
    { title: "✦ Beauty Tips & Rituals", body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself." },
    { title: "✦ Subscriber-Only Access", body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions." },
    { title: "✦ First at the Drop", body: "Priority access to limited product releases before they go public. Never miss a drop." },
  ],
  communityDisclaimer: "No spam. Ever. Unsubscribe anytime.",
};

function resolveImage(image: unknown, width: number, fallback: string): string {
  if (!image) return fallback;
  try {
    return urlFor(image).width(width).url();
  } catch {
    return fallback;
  }
}

function Headline({
  as: Tag = "h2",
  lines,
  fontSize,
  color,
  amber,
  marginBottom,
  lineHeight = 1.05,
}: {
  as?: "h1" | "h2";
  lines: HeadlineLine[];
  fontSize: string;
  color: string;
  amber: string;
  marginBottom: number;
  lineHeight?: number;
}) {
  return (
    <Tag
      style={{
        fontFamily: PLAYFAIR,
        fontSize,
        fontWeight: 400,
        lineHeight,
        letterSpacing: "-0.01em",
        color,
        marginBottom,
      }}
    >
      {lines.map((line, idx) => (
        <span key={idx}>
          {line.emphasis ? (
            <span style={{ color: amber, fontStyle: "italic" }}>{line.text}</span>
          ) : (
            line.text
          )}
          {idx < lines.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  );
}

export default function SerifLuxeClient({ content }: { content: DesignEContent }) {
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [key: string]: number }>({});

  const products = content.products?.length
    ? content.products
    : [];
  const testimonials = content.testimonials?.length ? content.testimonials : [];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const intervals = products
      .filter((p) => p.photos.length > 1)
      .map((p) =>
        setInterval(() => {
          setActivePhotoIdx((prev) => ({
            ...prev,
            [p._id]: ((prev[p._id] ?? 0) + 1) % p.photos.length,
          }));
        }, 5000)
      );
    return () => intervals.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  const t = dark
    ? {
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
      }
    : {
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

  const navLinks = content.siteSettings?.navLinks?.length ? content.siteSettings.navLinks : FALLBACK.navLinks;
  const logoSrc = resolveImage(content.siteSettings?.logo, 400, FALLBACK.logo);
  const footerTagline = content.siteSettings?.footerTagline ?? FALLBACK.footerTagline;
  const footerNote = content.siteSettings?.footerNote ?? FALLBACK.footerNote;
  const copyrightText = content.siteSettings?.copyrightText ?? FALLBACK.copyrightText;
  const socialLinks = content.siteSettings?.socialLinks?.length
    ? content.siteSettings.socialLinks
    : FALLBACK.socialLinks;

  const heroEyebrow = content.hero?.eyebrow ?? FALLBACK.heroEyebrow;
  const heroHeadline = content.hero?.headlineLines?.length ? content.hero.headlineLines : FALLBACK.heroHeadline;
  const heroSubhead = content.hero?.subhead ?? FALLBACK.heroSubhead;
  const heroBackground = resolveImage(content.hero?.backgroundImage, 1600, FALLBACK.heroBackground);
  const heroCtas = content.hero?.ctaButtons?.length ? content.hero.ctaButtons : FALLBACK.heroCtas;

  const marqueePhrases = content.marquee?.phrases?.length ? content.marquee.phrases : FALLBACK.marqueePhrases;
  const marqueeText = marqueePhrases.join(" · ");

  const storyEyebrow = content.story?.eyebrow ?? FALLBACK.storyEyebrow;
  const storyHeadline = content.story?.headlineLines?.length ? content.story.headlineLines : FALLBACK.storyHeadline;
  const storyParagraphs = content.story?.paragraphs?.length ? content.story.paragraphs : FALLBACK.storyParagraphs;
  const storyPullQuote = content.story?.pullQuote ?? FALLBACK.storyPullQuote;
  const storyCtaLabel = content.story?.ctaLabel ?? FALLBACK.storyCtaLabel;
  const storyCtaHref = content.story?.ctaHref ?? FALLBACK.storyCtaHref;

  const liveSellingEyebrow = content.liveSelling?.eyebrow ?? FALLBACK.liveSellingEyebrow;
  const liveSellingHeadline = content.liveSelling?.headlineLines?.length
    ? content.liveSelling.headlineLines
    : FALLBACK.liveSellingHeadline;
  const liveSellingBody = content.liveSelling?.body ?? FALLBACK.liveSellingBody;
  const liveSellingChannels = content.liveSelling?.channels?.length
    ? content.liveSelling.channels
    : FALLBACK.liveSellingChannels;
  const liveSellingFooterLine = content.liveSelling?.footerLine ?? FALLBACK.liveSellingFooterLine;

  const communityBadge = content.community?.badge ?? FALLBACK.communityBadge;
  const communityHeadline = content.community?.headline ?? FALLBACK.communityHeadline;
  const communityBody = content.community?.body ?? FALLBACK.communityBody;
  const communityBenefits = content.community?.benefits?.length
    ? content.community.benefits
    : FALLBACK.communityBenefits;
  const communityDisclaimer = content.community?.disclaimer ?? FALLBACK.communityDisclaimer;

  return (
    <div style={{ background: t.BG, color: t.TEXT, fontFamily: INTER, minHeight: "100vh" }}>
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
            {!isMobile && navLinks.map((item) => (
              <a key={item.label} href={item.href} style={{ color: t.MUTED, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: INTER, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = t.MUTED)}>
                {item.label}
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
        <a href="/"><img src={logoSrc} alt="ELYXIER" style={{ height: isMobile ? "72px" : "130px", width: "auto", display: "block" }} /></a>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: isMobile ? "80vh" : "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img
          src={heroBackground}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: dark ? 0.2 : 0.08 }}
        />
        <div style={{ position: "absolute", inset: 0, background: t.BG, zIndex: 1, opacity: dark ? 0.78 : 0.88 }} />
        <div style={{ position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)", width: "55%", height: "90vh", background: `radial-gradient(ellipse at center, ${t.AMBER_GLOW}18 0%, ${t.AMBER}0A 45%, transparent 70%)`, borderRadius: "50%", zIndex: 2 }} />
        <div style={{ position: "absolute", right: "5%", top: "20%", width: isMobile ? 150 : 300, height: isMobile ? 150 : 300, background: `radial-gradient(circle, ${t.AMBER}12 0%, transparent 70%)`, borderRadius: "50%", zIndex: 2 }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 760, margin: "0 auto", padding: isMobile ? "80px 24px" : "120px 32px", width: "100%" }}>
          <p style={{ color: t.AMBER, fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontFamily: INTER, fontWeight: 600 }}>
            {heroEyebrow}
          </p>
          <Headline as="h1" lines={heroHeadline} fontSize="clamp(54px, 7vw, 100px)" color={t.TEXT} amber={t.AMBER} marginBottom={32} lineHeight={1.0} />
          <p style={{ color: t.MUTED, fontSize: isMobile ? 16 : 18, maxWidth: 480, lineHeight: 1.75, marginBottom: 52, fontFamily: INTER }}>
            {heroSubhead}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {heroCtas.map((cta, idx) => (
              <a
                key={cta.label}
                href={cta.href}
                style={
                  idx === 0
                    ? { background: t.AMBER, color: "#0A0A08", padding: "16px 44px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }
                    : { border: `2px solid ${t.AMBER}`, color: t.AMBER, padding: "16px 44px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", background: "transparent" }
                }
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div style={{ background: t.AMBER, overflow: "hidden", padding: "14px 0", borderTop: `2px solid ${t.AMBER_GLOW}`, borderBottom: `2px solid ${t.AMBER_GLOW}` }}>
        <div style={{ display: "flex", width: "200%", animation: "marquee 22s linear infinite" }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ whiteSpace: "nowrap", flex: "0 0 50%", fontFamily: PLAYFAIR, fontSize: 18, fontStyle: "italic", color: "#0A0A08" }}>
              {marqueeText} &nbsp;·&nbsp; {marqueeText} &nbsp;·&nbsp;
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
            {products.map((p) => {
              const photoUrls = p.photos.map((photo) => resolveImage(photo, 600, ""));
              const idx = activePhotoIdx[p._id] ?? 0;
              return (
                <div
                  key={p._id}
                  style={{ perspective: "1000px", height: isMobile ? "320px" : "380px", cursor: "pointer" }}
                  onMouseEnter={() => !isMobile && setFlippedCard(p._id)}
                  onMouseLeave={() => !isMobile && setFlippedCard(null)}
                  onClick={() => setFlippedCard(flippedCard === p._id ? null : p._id)}
                >
                  <div style={{
                    position: "relative", width: "100%", height: "100%",
                    transformStyle: "preserve-3d" as const,
                    transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: flippedCard === p._id ? "rotateY(180deg)" : "rotateY(0deg)",
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
                        <img key={photoUrls[idx]} src={photoUrls[idx]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 1.4s ease-in-out" }} />
                        {photoUrls.length > 1 && (
                          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 2 }}>
                            {photoUrls.map((_, i) => (
                              <div
                                key={i}
                                style={{ width: 6, height: 6, borderRadius: "50%", background: idx === i ? "#fff" : "rgba(255,255,255,0.45)", transition: "background 0.4s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "16px 20px 12px" }}>
                        <h3 style={{ fontFamily: PLAYFAIR, fontSize: 20, fontWeight: 400, color: t.TEXT, marginBottom: 6 }}>{p.name}</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 20, fontStyle: "italic" }}>${p.price.toFixed(2)}</span>
                          <span style={{ color: t.MUTED, fontSize: 10, letterSpacing: "0.15em", fontFamily: INTER }}>✦ DISCOVER</span>
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
                      <p style={{ color: t.AMBER, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" as const, marginBottom: 10, fontFamily: INTER }}>The Blend</p>
                      <h3 style={{ fontFamily: PLAYFAIR, fontSize: 20, fontWeight: 400, color: t.TEXT, marginBottom: 14 }}>{p.name}</h3>
                      <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 20, fontFamily: INTER }}>{p.blurb}</p>
                      <span style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 20, fontStyle: "italic", display: "block", marginBottom: 16 }}>${p.price.toFixed(2)}</span>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{
                          background: `linear-gradient(135deg, ${t.AMBER}, ${dark ? "#E8A820" : "#D4920A"})`,
                          color: "#0A0A08",
                          border: "none",
                          padding: "15px 0",
                          fontSize: 11,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase" as const,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: `0 4px 20px ${t.AMBER}50`,
                          fontFamily: INTER,
                        }}
                      >
                        Add to Ritual ✦
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
                <span style={{ fontFamily: PLAYFAIR, fontSize: 160, fontStyle: "italic", fontWeight: 400, color: t.STORY_E_TEXT, lineHeight: 1, opacity: 0.9 }}>E</span>
              </div>
            </div>
          )}
          <div>
            <p style={{ color: t.AMBER, fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 20 }}>{storyEyebrow}</p>
            <Headline lines={storyHeadline} fontSize="clamp(32px, 4vw, 54px)" color={t.STORY_TEXT} amber={t.AMBER} marginBottom={28} lineHeight={1.15} />
            {storyParagraphs.map((paragraph, idx) => (
              <p key={idx} style={{ color: dark ? "#C0B090" : "#3A2800", fontSize: 16, lineHeight: 1.85, marginBottom: idx === storyParagraphs.length - 1 ? 28 : 24, fontFamily: INTER }}>
                {paragraph}
              </p>
            ))}
            <p style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 20, fontStyle: "italic", letterSpacing: "0.02em", marginBottom: 36 }}>
              &ldquo;{storyPullQuote}&rdquo;
            </p>
            <a href={storyCtaHref} style={{ background: t.AMBER, color: "#0A0A08", padding: "14px 36px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              {storyCtaLabel}
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
          <p style={{ color: t.AMBER, fontFamily: INTER, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20 }}>{liveSellingEyebrow}</p>
          <Headline lines={liveSellingHeadline} fontSize="clamp(48px, 7vw, 96px)" color={t.TEXT} amber={t.AMBER} marginBottom={28} lineHeight={1.05} />
          <p style={{ color: t.MUTED, fontSize: 17, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px", fontFamily: INTER }}>
            {liveSellingBody}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {liveSellingChannels.map((c) => (
              <a key={c.label} href={c.href} style={{ background: t.BTN_PRIMARY_BG, color: t.BTN_PRIMARY_TEXT, padding: "12px 28px", fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", borderRadius: 2 }}>
                {c.label}
              </a>
            ))}
          </div>
          <p style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 18, fontStyle: "italic" }}>{liveSellingFooterLine}</p>
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
              <div key={r._id} style={{ background: t.CARD, padding: "32px 28px", borderLeft: `3px solid ${t.AMBER}` }}>
                <p style={{ color: t.MUTED, fontSize: 15, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20, fontFamily: PLAYFAIR }}>
                  &ldquo;{r.quote}&rdquo;
                </p>
                <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: t.AMBER }}>— {r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section style={{ background: dark ? "#0A0A08" : "#FFF8ED", padding: isMobile ? "64px 16px" : "100px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: `${t.AMBER}18`, border: `1px solid ${t.AMBER}44`, color: t.AMBER, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase" as const, padding: "6px 20px", marginBottom: 24, fontFamily: INTER, fontWeight: 700 }}>{communityBadge}</span>
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: "clamp(30px, 4.5vw, 60px)", fontWeight: 400, color: t.TEXT, marginBottom: 16, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{communityHeadline}</h2>
          <p style={{ color: t.MUTED, fontSize: 16, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px", fontFamily: INTER }}>
            {communityBody}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {communityBenefits.map((b) => (
              <div key={b.title} style={{ background: dark ? "#141410" : "#FFFFFF", border: `1px solid ${t.AMBER}22`, padding: "24px 20px", textAlign: "left" }}>
                <p style={{ color: t.AMBER, fontFamily: PLAYFAIR, fontSize: 15, fontStyle: "italic", marginBottom: 10 }}>{b.title}</p>
                <p style={{ color: t.MUTED, fontSize: 13, lineHeight: 1.7, fontFamily: INTER }}>{b.body}</p>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 12 }}>
            <input type="text" placeholder="Full Name" style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: INTER, borderRadius: 2 }} />
            <input type="email" placeholder="Email Address" style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: INTER, borderRadius: 2 }} />
            <input type="tel" placeholder="Phone Number" style={{ background: t.INPUT_BG, color: t.INPUT_TEXT, border: `2px solid ${t.AMBER}44`, padding: "14px 18px", fontSize: 15, outline: "none", fontFamily: INTER, borderRadius: 2 }} />
            <button style={{ background: `linear-gradient(135deg, ${t.AMBER}, ${dark ? "#E8A820" : "#D4920A"})`, color: "#0A0A08", border: "none", padding: "16px 0", fontFamily: INTER, fontSize: 15, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", boxShadow: `0 4px 24px ${t.AMBER}40`, marginTop: 4 }}>
              Join the Circle
            </button>
            <p style={{ color: `${t.MUTED}88`, fontSize: 12, marginTop: 4, fontFamily: INTER }}>{communityDisclaimer}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: t.FOOTER_BG, padding: isMobile ? "40px 16px" : "56px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src={logoSrc} alt="ELYXIER" style={{ height: "56px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
            <p style={{ color: "#6B6050", fontSize: 13, marginTop: 8, letterSpacing: "0.05em", fontFamily: INTER }}>
              {footerTagline}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 28, flexWrap: "wrap", marginBottom: 32 }}>
            {socialLinks.map((s) => (
              <a key={s.platform} href={s.href} style={{ color: "#6B6050", fontSize: 12, textDecoration: "none", letterSpacing: "0.08em", fontFamily: INTER, textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = t.AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = "#6B6050")}>
                {s.platform}
              </a>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1A1A14", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: INTER }}>{copyrightText}</p>
            <p style={{ color: "#444440", fontSize: 11, fontFamily: INTER }}>{footerNote}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { getWriteClient } from "@/sanity/writeClient";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { logoutAdmin } from "../products/actions";
import AdminNav from "../AdminNav";
import TestimonialsEditor from "./TestimonialsEditor";
import { saveHero, saveStory, saveCommunity, saveLiveSelling, saveMarquee, saveSiteSettings, saveLiveStatus } from "./actions";
import { AMBER, CARD, INPUT_STYLE, LABEL_STYLE, BTN_STYLE, HeadlineLinesFields, LabelHrefListFields, TextListFields, TitleBodyListFields } from "./FormFields";
import { getLiveStatus } from "@/db/liveStatus";

type Line = { text: string; emphasis: boolean };
type LabelHref = { _key: string; label: string; href: string };

type HeroDoc = { eyebrow: string; subhead: string; headlineLines: Line[]; ctaButtons: LabelHref[]; backgroundImage?: unknown };
type StoryDoc = { eyebrow: string; headlineLines: Line[]; paragraphs: string[]; pullQuote: string; ctaLabel: string; ctaHref: string };
type CommunityDoc = { badge: string; headline: string; body: string; benefits: { title: string; body: string }[]; disclaimer: string };
type LiveSellingDoc = { eyebrow: string; headlineLines: Line[]; body: string; channels: LabelHref[]; footerLine: string };
type MarqueeDoc = { phrases: string[] };
type SiteSettingsDoc = {
  navLinks: LabelHref[];
  footerTagline: string;
  footerNote: string;
  copyrightText: string;
  socialLinks: { _key: string; platform: string; href: string }[];
  logo?: unknown;
  productsEyebrow?: string;
  productsHeading?: string;
  productCardBackLabel?: string;
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
};
type TestimonialDoc = { _id: string; quote: string; name: string };

export const dynamic = "force-dynamic";

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: CARD, padding: 24, marginBottom: 32 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>{title}</h2>
      <p style={{ color: "var(--admin-muted)", fontSize: 12, marginBottom: 20 }}>{description}</p>
      {children}
    </section>
  );
}

export default async function AdminContentPage() {
  const client = getWriteClient();
  const [hero, story, community, liveSelling, marquee, siteSettings, testimonials, liveStatus] = await Promise.all([
    client.fetch<HeroDoc | null>(`*[_type == "hero"][0]{eyebrow, subhead, headlineLines, ctaButtons, backgroundImage}`),
    client.fetch<StoryDoc | null>(`*[_type == "story"][0]{eyebrow, headlineLines, paragraphs, pullQuote, ctaLabel, ctaHref}`),
    client.fetch<CommunityDoc | null>(`*[_type == "community"][0]{badge, headline, body, benefits, disclaimer}`),
    client.fetch<LiveSellingDoc | null>(`*[_type == "liveSelling"][0]{eyebrow, headlineLines, body, channels, footerLine}`),
    client.fetch<MarqueeDoc | null>(`*[_type == "marquee"][0]{phrases}`),
    client.fetch<SiteSettingsDoc | null>(`*[_type == "siteSettings"][0]{navLinks, footerTagline, footerNote, copyrightText, socialLinks, logo, productsEyebrow, productsHeading, productCardBackLabel, testimonialsEyebrow, testimonialsHeading}`),
    client.fetch<TestimonialDoc[]>(`*[_type == "testimonial"] | order(orderRank asc){_id, quote, name}`),
    getLiveStatus(),
  ]);

  const heroLines = hero?.headlineLines ?? [];
  const heroCtas = hero?.ctaButtons ?? [];
  const heroBgUrl = hero?.backgroundImage ? urlFor(hero.backgroundImage as SanityImageSource).width(200).url() : null;
  const logoUrl = siteSettings?.logo ? urlFor(siteSettings.logo as SanityImageSource).width(200).url() : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "var(--admin-ink)", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Site Content</h1>
          </div>
          <form action={logoutAdmin} className="print:hidden">
            <button type="submit" style={{ background: "transparent", border: "1px solid var(--admin-border-strong)", color: "var(--admin-muted)", borderRadius: 4, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>
              Log Out
            </button>
          </form>
        </div>

        <AdminNav active="content" />

        <SectionCard title="Live Now" description="Flip these on right when you go live — shows a pulsing badge on the site linking to your stream.">
          <form action={saveLiveStatus} style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--admin-ink)" }}>
              <input type="checkbox" name="instagramLive" defaultChecked={liveStatus.instagramLive} />
              Live on Instagram
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--admin-ink)" }}>
              <input type="checkbox" name="tiktokLive" defaultChecked={liveStatus.tiktokLive} />
              Live on TikTok
            </label>
            <button type="submit" style={BTN_STYLE}>
              Save
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Homepage Hero" description={'The banner customers see first. Headline lines render in order, all caps; check "emphasize" on one to highlight it in amber.'}>
          <form action={saveHero} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Eyebrow</label>
              <input type="text" name="eyebrow" defaultValue={hero?.eyebrow ?? ""} style={INPUT_STYLE} />
            </div>
            <HeadlineLinesFields lines={heroLines} max={4} />
            <div>
              <label style={LABEL_STYLE}>Subhead</label>
              <input type="text" name="subhead" defaultValue={hero?.subhead ?? ""} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Background Image {heroBgUrl && "(current shown below — upload a new one to replace it)"}</label>
              {heroBgUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroBgUrl} alt="" style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 4, border: "1px solid var(--admin-border)", marginBottom: 8, display: "block" }} />
              )}
              <input type="file" name="backgroundImage" accept="image/*" style={{ fontSize: 12, color: "var(--admin-muted)" }} />
            </div>
            <LabelHrefListFields items={heroCtas} prefix="cta" max={3} label="CTA Buttons (up to 3 — first renders filled, rest outlined)" hrefPlaceholder="Link (e.g. #shop)" />
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Hero
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Brand Story" description="The About section. Headline and pull quote render all caps.">
          <form action={saveStory} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Eyebrow</label>
              <input type="text" name="eyebrow" defaultValue={story?.eyebrow ?? ""} style={INPUT_STYLE} />
            </div>
            <HeadlineLinesFields lines={story?.headlineLines ?? []} max={4} />
            <TextListFields items={story?.paragraphs ?? []} prefix="paragraph" max={5} label="Body Paragraphs (up to 5)" rows={3} />
            <div>
              <label style={LABEL_STYLE}>Pull Quote</label>
              <input type="text" name="pullQuote" defaultValue={story?.pullQuote ?? ""} style={INPUT_STYLE} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>CTA Label</label>
                <input type="text" name="ctaLabel" defaultValue={story?.ctaLabel ?? ""} style={INPUT_STYLE} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>CTA Link</label>
                <input type="text" name="ctaHref" defaultValue={story?.ctaHref ?? ""} style={INPUT_STYLE} />
              </div>
            </div>
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Brand Story
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Live Selling CTA" description="Promotes live-selling channels (TikTok, Instagram, etc).">
          <form action={saveLiveSelling} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Eyebrow</label>
              <input type="text" name="eyebrow" defaultValue={liveSelling?.eyebrow ?? ""} style={INPUT_STYLE} />
            </div>
            <HeadlineLinesFields lines={liveSelling?.headlineLines ?? []} max={4} />
            <div>
              <label style={LABEL_STYLE}>Body</label>
              <textarea name="body" defaultValue={liveSelling?.body ?? ""} rows={2} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
            </div>
            <LabelHrefListFields items={liveSelling?.channels ?? []} prefix="channel" max={6} label="Channel Buttons (e.g. TikTok, Instagram)" labelPlaceholder="Platform name" hrefPlaceholder="Link" />
            <div>
              <label style={LABEL_STYLE}>Footer Line</label>
              <input type="text" name="footerLine" defaultValue={liveSelling?.footerLine ?? ""} style={INPUT_STYLE} />
            </div>
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Live Selling
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Marquee Ticker" description="Short words/phrases that scroll across the amber ticker strip, in order.">
          <form action={saveMarquee} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextListFields items={marquee?.phrases ?? []} prefix="phrase" max={10} label="Phrases (up to 10, in order)" />
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Marquee
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Community Sign-Up" description="The email/phone capture section near the bottom of the page.">
          <form action={saveCommunity} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Badge</label>
              <input type="text" name="badge" defaultValue={community?.badge ?? ""} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Headline</label>
              <input type="text" name="headline" defaultValue={community?.headline ?? ""} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Body</label>
              <textarea name="body" defaultValue={community?.body ?? ""} rows={2} style={{ ...INPUT_STYLE, resize: "vertical" as const }} />
            </div>
            <TitleBodyListFields items={community?.benefits ?? []} prefix="benefit" max={3} label="Benefit Cards (up to 3)" />
            <div>
              <label style={LABEL_STYLE}>Disclaimer</label>
              <input type="text" name="disclaimer" defaultValue={community?.disclaimer ?? ""} style={INPUT_STYLE} />
            </div>
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Community
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Site Settings" description="Nav links, logo, footer text, and social links used across the site.">
          <form action={saveSiteSettings} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <LabelHrefListFields items={siteSettings?.navLinks ?? []} prefix="nav" max={6} label="Nav Links" />
            <div>
              <label style={LABEL_STYLE}>Logo {logoUrl && "(current shown below — upload a new one to replace it)"}</label>
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 4, border: "1px solid var(--admin-border)", marginBottom: 8, display: "block", background: "#000" }} />
              )}
              <input type="file" name="logo" accept="image/*" style={{ fontSize: 12, color: "var(--admin-muted)" }} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Footer Tagline</label>
              <input type="text" name="footerTagline" defaultValue={siteSettings?.footerTagline ?? ""} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Footer Note</label>
              <input type="text" name="footerNote" defaultValue={siteSettings?.footerNote ?? ""} style={INPUT_STYLE} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Copyright Text</label>
              <input type="text" name="copyrightText" defaultValue={siteSettings?.copyrightText ?? ""} style={INPUT_STYLE} />
            </div>
            <LabelHrefListFields
              items={siteSettings?.socialLinks ?? []}
              prefix="social"
              max={6}
              label="Social Links (footer row)"
              labelPlaceholder="Platform name"
              hrefPlaceholder="Link"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Products Section Eyebrow</label>
                <input type="text" name="productsEyebrow" defaultValue={siteSettings?.productsEyebrow ?? ""} style={INPUT_STYLE} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Products Section Heading</label>
                <input type="text" name="productsHeading" defaultValue={siteSettings?.productsHeading ?? ""} style={INPUT_STYLE} />
              </div>
            </div>
            <div>
              <label style={LABEL_STYLE}>Product Card Back Label (e.g. &quot;The Blend&quot;)</label>
              <input type="text" name="productCardBackLabel" defaultValue={siteSettings?.productCardBackLabel ?? ""} style={INPUT_STYLE} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Testimonials Section Eyebrow</label>
                <input type="text" name="testimonialsEyebrow" defaultValue={siteSettings?.testimonialsEyebrow ?? ""} style={INPUT_STYLE} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Testimonials Section Heading</label>
                <input type="text" name="testimonialsHeading" defaultValue={siteSettings?.testimonialsHeading ?? ""} style={INPUT_STYLE} />
              </div>
            </div>
            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Site Settings
            </button>
          </form>
        </SectionCard>

        <TestimonialsEditor testimonials={testimonials} />
      </div>
    </div>
  );
}

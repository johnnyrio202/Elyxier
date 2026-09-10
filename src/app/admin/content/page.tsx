import { getWriteClient } from "@/sanity/writeClient";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { logoutAdmin } from "../products/actions";
import AdminNav from "../AdminNav";
import TestimonialsEditor from "./TestimonialsEditor";
import { saveHero } from "./actions";

const AMBER = "#D4920A";
const BG = "#0A0A08";
const CARD = "#141410";
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: `1px solid ${AMBER}55`,
  borderRadius: 4,
  color: "#FAF7F0",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
const LABEL_STYLE: React.CSSProperties = { display: "block", fontSize: 11, color: "#9A8A70", marginBottom: 4 };
const BTN_STYLE: React.CSSProperties = {
  background: AMBER,
  color: "#0A0A08",
  border: "none",
  borderRadius: 4,
  padding: "10px 20px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};

type HeroDoc = {
  eyebrow: string;
  subhead: string;
  headlineLines: { _key: string; text: string; emphasis: boolean }[];
  ctaButtons: { _key: string; label: string; href: string }[];
  backgroundImage?: unknown;
};

type TestimonialDoc = { _id: string; quote: string; name: string };

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const client = getWriteClient();
  const [hero, testimonials] = await Promise.all([
    client.fetch<HeroDoc | null>(`*[_type == "hero"][0]{eyebrow, subhead, headlineLines, ctaButtons, backgroundImage}`),
    client.fetch<TestimonialDoc[]>(`*[_type == "testimonial"] | order(orderRank asc){_id, quote, name}`),
  ]);

  const lines = hero?.headlineLines ?? [];
  const ctas = hero?.ctaButtons ?? [];
  const bgUrl = hero?.backgroundImage ? urlFor(hero.backgroundImage as SanityImageSource).width(200).url() : null;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
              Elyxier Admin
            </p>
            <h1 style={{ fontSize: 28, margin: 0 }}>Site Content</h1>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" style={{ background: "transparent", border: `1px solid ${AMBER}55`, color: "#9A8A70", borderRadius: 4, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>
              Log Out
            </button>
          </form>
        </div>

        <AdminNav active="content" />

        {/* Hero */}
        <section style={{ border: `1px solid ${AMBER}33`, borderRadius: 8, background: CARD, padding: 24, marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Homepage Hero</h2>
          <p style={{ color: "#9A8A70", fontSize: 12, marginBottom: 20 }}>
            The banner customers see first. Headline lines render in order, all caps; check &quot;emphasize&quot; on one to highlight it in amber.
          </p>
          <form action={saveHero} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Eyebrow</label>
              <input type="text" name="eyebrow" defaultValue={hero?.eyebrow ?? ""} style={INPUT_STYLE} />
            </div>

            <div>
              <label style={LABEL_STYLE}>Headline Lines (up to 4 — leave text blank to skip a slot)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="text" name={`line${i}Text`} defaultValue={lines[i]?.text ?? ""} placeholder={`Line ${i + 1}`} style={{ ...INPUT_STYLE, flex: 1 }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9A8A70", whiteSpace: "nowrap" }}>
                      <input type="checkbox" name={`line${i}Emphasis`} defaultChecked={lines[i]?.emphasis ?? false} />
                      Emphasize
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={LABEL_STYLE}>Subhead</label>
              <input type="text" name="subhead" defaultValue={hero?.subhead ?? ""} style={INPUT_STYLE} />
            </div>

            <div>
              <label style={LABEL_STYLE}>Background Image {bgUrl && "(current shown below — upload a new one to replace it)"}</label>
              {bgUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bgUrl} alt="" style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 4, border: `1px solid ${AMBER}33`, marginBottom: 8, display: "block" }} />
              )}
              <input type="file" name="backgroundImage" accept="image/*" style={{ fontSize: 12, color: "#9A8A70" }} />
            </div>

            <div>
              <label style={LABEL_STYLE}>CTA Buttons (up to 3 — first renders filled, rest outlined)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <input type="text" name={`cta${i}Label`} defaultValue={ctas[i]?.label ?? ""} placeholder="Label" style={{ ...INPUT_STYLE, flex: 1 }} />
                    <input type="text" name={`cta${i}Href`} defaultValue={ctas[i]?.href ?? ""} placeholder="Link (e.g. #shop)" style={{ ...INPUT_STYLE, flex: 1 }} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" style={{ ...BTN_STYLE, alignSelf: "flex-start" }}>
              Save Hero
            </button>
          </form>
        </section>

        {/* Testimonials */}
        <TestimonialsEditor testimonials={testimonials} />
      </div>
    </div>
  );
}

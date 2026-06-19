import Link from "next/link";

const designs = [
  {
    id: "design-a",
    name: "A — Midnight Luxe",
    tagline: "Dark, editorial luxury — Chanel meets skincare.",
    font: "Playfair Display + Inter",
    swatches: ["#0C0C0E", "#C9A257", "#F5F1EA"],
    border: "#C9A257",
  },
  {
    id: "design-b",
    name: "B — Warm Ivory",
    tagline: "Warm, skin-toned artisan luxury — approachable and glowing.",
    font: "Cormorant Garamond + DM Sans",
    swatches: ["#FAF7F2", "#CC8800", "#2A1810"],
    border: "#CC8800",
  },
  {
    id: "design-c",
    name: "C — Bold Canvas",
    tagline: "High-contrast and social-first — Fashion Nova × Sephora energy.",
    font: "Montserrat + Nunito",
    swatches: ["#4A1259", "#D4A0A0", "#C41E3A"],
    border: "#C41E3A",
  },
  {
    id: "design-d",
    name: "D — Elevated Glam",
    tagline: "Bold luxury with personality. Your brand's energy meets spa-level sophistication.",
    font: "Bebas Neue + DM Sans",
    swatches: ["#0A0A08", "#D4920A", "#FAF7F0"],
    border: "#D4920A",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#0A0A0A", color: "#FFFFFF" }}
    >
      <div className="max-w-5xl w-full">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "#888" }}
        >
          Globalist.Pro — Client Review
        </p>
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ELYXIER
        </h1>
        <p className="text-lg mb-3" style={{ color: "#999" }}>
          Four design directions for your approval, Data.
        </p>
        <p className="text-sm mb-14" style={{ color: "#666" }}>
          Each design includes a light &amp; dark mode toggle — look for the button in the top-right corner.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {designs.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "#141414",
                border: `1px solid ${d.border}33`,
              }}
            >
              <div className="flex gap-3 mb-1">
                {d.swatches.map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full"
                    style={{
                      background: color,
                      border: "1px solid #333",
                    }}
                  />
                ))}
              </div>
              <div>
                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: d.border }}
                >
                  {d.name}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#AAA" }}>
                  {d.tagline}
                </p>
              </div>
              <p className="text-xs" style={{ color: "#666" }}>
                {d.font}
              </p>
              <div className="text-xs px-2 py-1 rounded-full self-start" style={{ background: "#222", color: "#888", border: "1px solid #333" }}>
                Light &amp; Dark
              </div>
              <Link
                href={`/${d.id}`}
                className="mt-auto inline-flex items-center gap-2 text-sm font-medium py-2.5 px-5 rounded-full transition-all"
                style={{
                  background: d.border,
                  color: d.id === "design-b" ? "#2A1810" : "#000",
                }}
              >
                View Design →
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-12" style={{ color: "#444" }}>
          Built by Globalist.Pro · elyxier702@gmail.com
        </p>
      </div>
    </div>
  );
}

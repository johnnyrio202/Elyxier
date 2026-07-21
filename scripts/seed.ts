/**
 * One-time content seed for the Design E Sanity dataset.
 * Run with: npx sanity exec scripts/seed.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2026-01-01" });

async function uploadLocalImage(publicPath: string) {
  const filePath = path.join(process.cwd(), "public", publicPath);
  const buffer = fs.readFileSync(filePath);
  return client.assets.upload("image", buffer, { filename: path.basename(publicPath) });
}

async function uploadRemoteImage(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buffer, { filename });
}

function imageField(assetId: string) {
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: assetId } };
}

function key<T extends object>(obj: T) {
  return { _key: randomUUID(), ...obj };
}

const productsData = [
  {
    slug: "bare-bliss",
    name: "Bare Bliss",
    shortDesc: "Fragrance-free hydration for sensitive skin.",
    blurb:
      "Pure, nourishing hydration without added scents. Made with organic shea butter, mango butter, and skin-loving oils that deeply moisturize and soften even the most sensitive skin. No fragrance. No unnecessary additives. Just pure hydration your skin will love.",
    photos: ["/bare-bliss-hero.jpeg", "/bare-bliss-swirl.jpeg"],
  },
  {
    slug: "champagne-glow",
    name: "Champagne Glow",
    shortDesc: "Shimmer-infused butter with champagne and citrus.",
    blurb:
      "A radiant body butter infused with soft shimmer and bubbly champagne notes with bright citrus accords. Shea and mango butter deliver deep hydration while a delicate shimmer leaves skin luminous and sun-kissed with every application.",
    photos: ["/champagne-glow-hero.jpeg", "/champagne-glow-swirl.jpeg"],
  },
  {
    slug: "lilac-dreams",
    name: "Lilac Dreams",
    shortDesc: "Calming chamomile and lavender for nighttime rituals.",
    blurb:
      "A soothing blend of chamomile and soft lavender designed for your nighttime ritual. Rich shea and mango butter melt effortlessly into skin, leaving it silky smooth and beautifully nourished. Breathe it in, let go of the day, and drift into rest.",
    photos: ["/lilac-dreams-hero.jpeg", "/lilac-dreams-swirl.jpeg"],
  },
  {
    slug: "pink-silk",
    name: "Pink Silk",
    shortDesc: "Sweet fruits, florals, and warm vanilla in silky cream.",
    blurb:
      "A sweet, feminine blend of juicy fruits, sparkling citrus, soft florals, and warm vanilla. This rich, creamy formula melts into skin for lasting moisture without greasiness — leaving behind a silky, irresistible scent that is both playful and elegant.",
    photos: ["/pink-silk-hero.jpeg", "/pink-silk-swirl.jpeg"],
  },
  {
    slug: "rose-petal-silk",
    name: "Rose Petal Silk",
    shortDesc: "Delicate rose infused body butter for silky skin.",
    blurb:
      "Pressed rose petals and jojoba oil combine for a silky, weightless butter that glides on effortlessly. A signature floral scent you'll reach for every single day.",
    photos: [
      "https://images.unsplash.com/photo-1619451427882-6aaaded0cc61?w=600&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&h=600&fit=crop&q=80",
    ],
    isPlaceholderPhoto: true,
  },
  {
    slug: "citrus-burst",
    name: "Citrus Burst",
    shortDesc: "Energizing citrus blend to wake up your skin.",
    blurb:
      "Blood orange zest and grapefruit in a lightweight whipped butter. Energizes your senses and leaves skin glowing with a fresh, vibrant citrus finish.",
    photos: [
      "https://images.unsplash.com/photo-1629380108599-ea06489d66f5?w=600&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=600&fit=crop&q=80",
    ],
    isPlaceholderPhoto: true,
  },
];

const testimonialsData = [
  { name: "Jasmine T.", quote: "This body butter changed my entire routine. My skin has never felt so soft!" },
  { name: "Monique R.", quote: "I bought the Lavender & Honey and I'm obsessed. Already ordered 3 more!" },
  { name: "Tasha W.", quote: "Found her on TikTok Live and immediately bought everything. Worth every penny." },
];

async function run() {
  console.log("Uploading shared assets...");
  const logoAsset = await uploadLocalImage("/elyxier-logo.png");
  const heroBgAsset = await uploadRemoteImage(
    "https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=1600&h=900&fit=crop&q=80",
    "hero-bg.jpg"
  );

  console.log("Seeding siteSettings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    navLinks: [
      key({ label: "Shop", href: "#" }),
      key({ label: "About", href: "#about" }),
      key({ label: "Live", href: "#" }),
      key({ label: "Contact", href: "#" }),
    ],
    logo: imageField(logoAsset._id),
    footerTagline: "Luxury Body Butters & Oils · Handcrafted in Las Vegas",
    footerNote: "Temperature-sensitive products. Ships with care.",
    copyrightText: "© 2026 ELYXIER. All rights reserved.",
    socialLinks: [
      key({ platform: "TikTok", href: "#" }),
      key({ platform: "Instagram", href: "#" }),
      key({ platform: "Facebook", href: "#" }),
      key({ platform: "Whatnot", href: "#" }),
      key({ platform: "Amazon", href: "#" }),
    ],
  });

  console.log("Seeding hero...");
  await client.createOrReplace({
    _id: "hero",
    _type: "hero",
    eyebrow: "Handcrafted · Las Vegas · Since 2026",
    headlineLines: [
      key({ text: "Your Skin", emphasis: false }),
      key({ text: "Deserves", emphasis: true }),
      key({ text: "the Ritual", emphasis: false }),
    ],
    subhead: "Luxury body butters & oils made for women who invest in themselves.",
    backgroundImage: imageField(heroBgAsset._id),
    ctaButtons: [key({ label: "Shop Now", href: "#" }), key({ label: "Watch Us Live", href: "#" })],
  });

  console.log("Seeding marquee...");
  await client.createOrReplace({
    _id: "marquee",
    _type: "marquee",
    phrases: ["Whipped", "Handmade", "Skin Ritual", "Nourish", "Glow", "Live Selling", "Las Vegas", "Elyxier"],
  });

  console.log("Seeding story...");
  await client.createOrReplace({
    _id: "story",
    _type: "story",
    eyebrow: "Our Story",
    headlineLines: [
      key({ text: "Made with Intention.", emphasis: false }),
      key({ text: "Worn with Confidence.", emphasis: true }),
    ],
    paragraphs: [
      "ELYXIER was born from a simple truth: your skin deserves more. Founded by Data Gladden in Las Vegas, ELYXIER is a luxury body care brand built on the belief that self-care isn't a trend — it's a ritual. Every whipped butter and nourishing oil in our collection is handcrafted with intention, using premium ingredients chosen to nourish, protect, and celebrate your skin.",
      "What started as a personal obsession with finding products that actually worked became a passion for creating them. Data blends every formula herself, pouring care and craftsmanship into each jar so you receive something truly made with you in mind.",
      "ELYXIER is designed for women who invest in themselves — women who know that how you treat your body is a reflection of how you see yourself. We proudly celebrate women of all backgrounds, all skin tones, and all sizes, because luxury should never have a limit.",
    ],
    pullQuote: "Your skin. Your ritual. Your ELYXIER.",
    ctaLabel: "Meet the Maker",
    ctaHref: "#",
  });

  console.log("Seeding liveSelling...");
  await client.createOrReplace({
    _id: "liveSelling",
    _type: "liveSelling",
    eyebrow: "Catch Us Live",
    headlineLines: [key({ text: "Shop With", emphasis: false }), key({ text: "Us Live", emphasis: true })],
    body: "Join us on TikTok, Instagram, Facebook, and Whatnot for live selling events, product drops, and exclusive deals.",
    channels: [
      key({ label: "TikTok", href: "#" }),
      key({ label: "Instagram", href: "#" }),
      key({ label: "Facebook", href: "#" }),
      key({ label: "Whatnot", href: "#" }),
    ],
    footerLine: "Follow @elyxier702 for live alerts",
  });

  console.log("Seeding community...");
  await client.createOrReplace({
    _id: "community",
    _type: "community",
    badge: "Join the Inner Circle",
    headline: "Your Backstage Pass to ELYXIER",
    body: "This isn't just a newsletter — it's your all-access pass to the ELYXIER world. Join a community of women who invest in themselves.",
    benefits: [
      key({
        title: "✦ Beauty Tips & Rituals",
        body: "Weekly skin care hacks, DIY recipes, and insider routines curated by Data herself.",
      }),
      key({
        title: "✦ Subscriber-Only Access",
        body: "Exclusive tutorials, behind-the-scenes content, and members-only live sessions.",
      }),
      key({
        title: "✦ First at the Drop",
        body: "Priority access to limited product releases before they go public. Never miss a drop.",
      }),
    ],
    disclaimer: "No spam. Ever. Unsubscribe anytime.",
  });

  console.log("Seeding products...");
  for (const [i, p] of productsData.entries()) {
    const photoAssets = [];
    for (const [photoIdx, src] of p.photos.entries()) {
      const asset = src.startsWith("http")
        ? await uploadRemoteImage(src, `${p.slug}-${photoIdx}.jpg`)
        : await uploadLocalImage(src);
      photoAssets.push(key(imageField(asset._id)));
    }
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      price: 25,
      shortDesc: p.shortDesc,
      blurb: p.blurb,
      photos: photoAssets,
      order: i,
    });
    if (p.isPlaceholderPhoto) {
      console.log(`  ⚠ ${p.name}: seeded with a stock placeholder photo — swap for a real product photo in Studio.`);
    }
  }

  console.log("Seeding testimonials...");
  for (const [i, r] of testimonialsData.entries()) {
    await client.createOrReplace({
      _id: `testimonial-${i}`,
      _type: "testimonial",
      quote: r.quote,
      name: r.name,
      order: i,
    });
  }

  console.log("Done. Design E is now fully populated in Sanity.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

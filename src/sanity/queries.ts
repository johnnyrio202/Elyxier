import { groq } from "next-sanity";
import { client } from "./client";

export const DESIGN_E_TAG = "design-e";

const headlineLineProjection = groq`{ text, emphasis }`;
const linkProjection = groq`{ label, href }`;

export const designEQuery = groq`{
  "siteSettings": *[_type == "siteSettings"][0]{
    navLinks[]${linkProjection},
    logo,
    footerTagline,
    footerNote,
    copyrightText,
    socialLinks[]{ platform, href },
  },
  "hero": *[_type == "hero"][0]{
    eyebrow,
    headlineLines[]${headlineLineProjection},
    subhead,
    backgroundImage,
    ctaButtons[]${linkProjection},
  },
  "marquee": *[_type == "marquee"][0]{ phrases },
  "story": *[_type == "story"][0]{
    eyebrow,
    headlineLines[]${headlineLineProjection},
    paragraphs,
    pullQuote,
    ctaLabel,
    ctaHref,
  },
  "liveSelling": *[_type == "liveSelling"][0]{
    eyebrow,
    headlineLines[]${headlineLineProjection},
    body,
    channels[]${linkProjection},
    footerLine,
  },
  "community": *[_type == "community"][0]{
    badge,
    headline,
    body,
    benefits[]{ title, body },
    disclaimer,
  },
  "products": *[_type == "product"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    price,
    shortDesc,
    blurb,
    photos,
  },
  "testimonials": *[_type == "testimonial"] | order(order asc){
    _id,
    quote,
    name,
  },
}`;

export type DesignEContent = {
  siteSettings: {
    navLinks: { label: string; href: string }[];
    logo: unknown;
    footerTagline: string;
    footerNote: string;
    copyrightText: string;
    socialLinks: { platform: string; href: string }[];
  } | null;
  hero: {
    eyebrow: string;
    headlineLines: { text: string; emphasis: boolean }[];
    subhead: string;
    backgroundImage: unknown;
    ctaButtons: { label: string; href: string }[];
  } | null;
  marquee: { phrases: string[] } | null;
  story: {
    eyebrow: string;
    headlineLines: { text: string; emphasis: boolean }[];
    paragraphs: string[];
    pullQuote: string;
    ctaLabel: string;
    ctaHref: string;
  } | null;
  liveSelling: {
    eyebrow: string;
    headlineLines: { text: string; emphasis: boolean }[];
    body: string;
    channels: { label: string; href: string }[];
    footerLine: string;
  } | null;
  community: {
    badge: string;
    headline: string;
    body: string;
    benefits: { title: string; body: string }[];
    disclaimer: string;
  } | null;
  products: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    shortDesc: string;
    blurb: string;
    photos: unknown[];
  }[];
  testimonials: { _id: string; quote: string; name: string }[];
};

export async function getDesignEContent(): Promise<DesignEContent> {
  return client.fetch(designEQuery, {}, { next: { tags: [DESIGN_E_TAG] } });
}

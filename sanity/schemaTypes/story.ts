import { defineField, defineType } from "sanity";

export default defineType({
  name: "story",
  title: "Brand Story (About)",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headlineLines",
      title: "Headline Lines",
      type: "array",
      of: [
        defineField({
          name: "headlineLine",
          type: "object",
          fields: [
            defineField({ name: "text", type: "string", validation: (r) => r.required() }),
            defineField({ name: "emphasis", title: "Emphasize (amber italic)", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "text", subtitle: "emphasis" } },
        }),
      ],
      validation: (r) => r.min(1).max(4),
    }),
    defineField({
      name: "paragraphs",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({ name: "pullQuote", title: "Pull Quote", type: "string" }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA Link", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Brand Story (About)" }),
  },
});

import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headlineLines",
      title: "Headline Lines",
      description: "Rendered one per line, in order. Mark one line as emphasized (amber italic).",
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
    defineField({ name: "subhead", title: "Subhead", type: "text", rows: 2 }),
    defineField({ name: "backgroundImage", title: "Background Image", type: "image" }),
    defineField({
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [
        defineField({
          name: "ctaButton",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Hero" }),
  },
});

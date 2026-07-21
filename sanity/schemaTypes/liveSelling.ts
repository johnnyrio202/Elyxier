import { defineField, defineType } from "sanity";

export default defineType({
  name: "liveSelling",
  title: "Live Selling CTA",
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
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({
      name: "channels",
      title: "Channel Buttons",
      type: "array",
      of: [
        defineField({
          name: "channel",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "footerLine", title: "Footer Line", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Live Selling CTA" }),
  },
});

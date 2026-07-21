import { defineField, defineType } from "sanity";

export default defineType({
  name: "community",
  title: "Community Sign-up",
  type: "document",
  fields: [
    defineField({ name: "badge", title: "Badge", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({
      name: "benefits",
      title: "Benefit Cards",
      type: "array",
      of: [
        defineField({
          name: "benefit",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "disclaimer", title: "Disclaimer", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Community Sign-up" }),
  },
});

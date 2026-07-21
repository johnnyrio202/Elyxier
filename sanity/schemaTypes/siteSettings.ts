import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "navLinks",
      title: "Nav Links",
      type: "array",
      of: [
        defineField({
          name: "navLink",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "footerTagline", title: "Footer Tagline", type: "string" }),
    defineField({ name: "footerNote", title: "Footer Note", type: "string" }),
    defineField({ name: "copyrightText", title: "Copyright Text", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});

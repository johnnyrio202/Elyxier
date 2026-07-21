import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "price", title: "Price (USD)", type: "number", validation: (r) => r.required().positive() }),
    defineField({ name: "shortDesc", title: "Short Description", type: "string" }),
    defineField({ name: "blurb", title: "Full Blurb", type: "text", rows: 4 }),
    defineField({
      name: "photos",
      title: "Photos",
      description: "First photo shows first; if more than one, the card crossfades between them.",
      type: "array",
      of: [{ type: "image" }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers show first in the product grid.",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "shortDesc", media: "photos.0" },
  },
});

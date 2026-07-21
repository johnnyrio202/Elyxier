import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Customer Name", type: "string", validation: (r) => r.required() }),
    orderRankField({ type: "testimonial" }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "name", subtitle: "quote" },
  },
});

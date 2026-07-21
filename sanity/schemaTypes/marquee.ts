import { defineField, defineType } from "sanity";

export default defineType({
  name: "marquee",
  title: "Marquee Ticker",
  type: "document",
  fields: [
    defineField({
      name: "phrases",
      title: "Phrases",
      description: "Short words/phrases that scroll across the amber ticker strip, in order.",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Marquee Ticker" }),
  },
});

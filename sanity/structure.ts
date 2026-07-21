import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

const SINGLETONS = [
  { id: "siteSettings", title: "Site Settings" },
  { id: "hero", title: "Hero" },
  { id: "marquee", title: "Marquee Ticker" },
  { id: "story", title: "Brand Story (About)" },
  { id: "liveSelling", title: "Live Selling CTA" },
  { id: "community", title: "Community Sign-up" },
];

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("ELYXIER Content")
    .items([
      S.listItem()
        .title("Page Content")
        .child(
          S.list()
            .title("Page Content")
            .items(
              SINGLETONS.map(({ id, title }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType(id).documentId(id))
              )
            )
        ),
      S.divider(),
      orderableDocumentListDeskItem({ type: "product", title: "Products", S, context }),
      orderableDocumentListDeskItem({ type: "testimonial", title: "Testimonials", S, context }),
    ]);

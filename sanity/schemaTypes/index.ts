import { type SchemaTypeDefinition } from "sanity";

import siteSettings from "./siteSettings";
import hero from "./hero";
import marquee from "./marquee";
import story from "./story";
import liveSelling from "./liveSelling";
import community from "./community";
import product from "./product";
import testimonial from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, hero, marquee, story, liveSelling, community, product, testimonial],
};

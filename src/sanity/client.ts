import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Used only in draft mode (Presentation tool preview): reads unpublished
// drafts and stega-encodes results so the visual editing overlay can map
// rendered text back to the source field.
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "drafts",
  stega: {
    studioUrl: "/studio",
  },
});

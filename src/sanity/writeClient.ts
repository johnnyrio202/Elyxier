import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

let _client: SanityClient | null = null;

// Server-only client with write access, for the admin console's product
// create/edit/photo-upload actions. Never import this from client code —
// the token would end up in the browser bundle. Lazy so `next build`
// doesn't crash before SANITY_API_WRITE_TOKEN is provisioned.
export function getWriteClient(): SanityClient {
  if (!_client) {
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) throw new Error("SANITY_API_WRITE_TOKEN is not set");
    _client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });
  }
  return _client;
}

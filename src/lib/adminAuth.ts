import "server-only";

export const ADMIN_COOKIE = "elyxier_admin";

// Web Crypto (not Node's `crypto` module) so this also works from the
// middleware's edge-capable runtime without extra config.
async function expectedToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set");
  const data = new TextEncoder().encode(`elyxier-admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function checkAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export async function adminSessionToken(): Promise<string> {
  return expectedToken();
}

export async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  return token === (await expectedToken());
}

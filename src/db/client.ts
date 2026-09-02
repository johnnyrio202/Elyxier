import "server-only";
import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

// Lazy so `next build` doesn't crash before DATABASE_URL is provisioned.
export function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _sql = neon(url);
  }
  return _sql;
}

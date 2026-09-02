/**
 * Applies src/db/schema.sql to the Neon database.
 * Run with: npx dotenv -e .env.local -- npx tsx scripts/db/migrate.ts
 */
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set (run `vercel env pull .env.local` first)");

  const sql = neon(url);
  const schema = fs.readFileSync(path.join(process.cwd(), "src/db/schema.sql"), "utf-8");

  const withoutComments = schema
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = withoutComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    console.log(`Running: ${statement.slice(0, 60)}...`);
    await sql.query(statement);
  }

  console.log(`Applied ${statements.length} statements.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

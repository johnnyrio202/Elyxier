import "server-only";
import { getSql } from "./client";

export async function createLead(input: { name?: string; email: string; phone?: string; source?: string }): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO leads (name, email, phone, source)
    VALUES (${input.name ?? null}, ${input.email}, ${input.phone ?? null}, ${input.source ?? null})
  `;
}

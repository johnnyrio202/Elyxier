import "server-only";
import { getSql } from "./client";

export type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  source: string | null;
  createdAt: string;
};

export async function createLead(input: { name?: string; email: string; phone?: string; source?: string }): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO leads (name, email, phone, source)
    VALUES (${input.name ?? null}, ${input.email}, ${input.phone ?? null}, ${input.source ?? null})
  `;
}

export async function listLeads(): Promise<Lead[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, email, phone, source, created_at FROM leads ORDER BY created_at DESC
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string | null,
    email: r.email as string,
    phone: r.phone as string | null,
    source: r.source as string | null,
    createdAt: (r.created_at as Date).toISOString(),
  }));
}

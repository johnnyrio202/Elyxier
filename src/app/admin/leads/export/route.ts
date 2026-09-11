import { NextResponse } from "next/server";
import { listLeads } from "@/db/leads";

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const leads = await listLeads();
  const header = ["Name", "Email", "Phone", "Source", "Submitted"];
  const rows = leads.map((lead) => [
    lead.name ?? "",
    lead.email,
    lead.phone ?? "",
    lead.source ?? "",
    lead.createdAt,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvField).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elyxier-leads.csv"`,
    },
  });
}

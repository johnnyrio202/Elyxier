import { NextResponse, type NextRequest } from "next/server";
import { createLead } from "@/db/leads";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; email?: string; phone?: string; source?: string };
  if (!body.email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  await createLead({ name: body.name, email: body.email, phone: body.phone, source: body.source });
  return NextResponse.json({ ok: true });
}

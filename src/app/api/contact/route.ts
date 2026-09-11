import { NextResponse, type NextRequest } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; email?: string; message?: string };
  if (!body.name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!body.email?.trim()) return NextResponse.json({ error: "email is required" }, { status: 400 });
  if (!body.message?.trim()) return NextResponse.json({ error: "message is required" }, { status: 400 });

  await sendContactFormEmail({ name: body.name.trim(), email: body.email.trim(), message: body.message.trim() });
  return NextResponse.json({ ok: true });
}

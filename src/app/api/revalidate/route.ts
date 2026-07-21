import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { DESIGN_E_TAG } from "@/sanity/queries";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(DESIGN_E_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: DESIGN_E_TAG, now: Date.now() });
}

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { DESIGN_E_TAG } from "@/sanity/queries";

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(DESIGN_E_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: DESIGN_E_TAG, now: Date.now() });
}

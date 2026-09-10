import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { DESIGN_E_TAG, PRODUCTS_TAG, SITE_CONTENT_TAG } from "@/sanity/queries";

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
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  // The homepage's ISR full-route cache (`export const revalidate = 60` in
  // page.tsx) only clears via revalidatePath or its own timer, not fetch tags.
  revalidatePath("/", "page");

  return NextResponse.json({ revalidated: true, tags: [DESIGN_E_TAG, PRODUCTS_TAG, SITE_CONTENT_TAG], now: Date.now() });
}

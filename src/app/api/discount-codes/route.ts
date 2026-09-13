import { NextResponse, type NextRequest } from "next/server";
import { getRedeemableDiscount } from "@/db/discounts";

// Preview-only: tells the cart whether a code is currently redeemable and
// what it's worth, so the UI can show the discount before checkout. The
// order actually gets created (and the code's use is counted) separately —
// see /api/orders, which re-validates the code server-side rather than
// trusting whatever this endpoint returned earlier.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { code?: string };
  if (!body.code?.trim()) {
    return NextResponse.json({ valid: false, error: "Enter a code" }, { status: 400 });
  }

  const discount = await getRedeemableDiscount(body.code);
  if (!discount) {
    return NextResponse.json({ valid: false, error: "Invalid or expired code" }, { status: 404 });
  }

  return NextResponse.json({ valid: true, code: discount.code, type: discount.type, value: discount.value });
}

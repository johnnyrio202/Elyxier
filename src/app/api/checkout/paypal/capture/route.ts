import { NextResponse, type NextRequest } from "next/server";
import { capturePaypalOrder } from "@/lib/paypal";
import { markOrderPaid } from "@/db/orders";
import { handleOrderPaid } from "@/lib/orderFulfillment";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { paypalOrderId?: string };
  if (!body.paypalOrderId) return NextResponse.json({ error: "paypalOrderId is required" }, { status: 400 });

  const { status, customId, shippingAddress } = await capturePaypalOrder(body.paypalOrderId);
  if (status === "COMPLETED" && customId) {
    const justPaid = await markOrderPaid(customId, { shippingAddress: shippingAddress ?? undefined });
    if (justPaid) await handleOrderPaid(customId);
  }

  return NextResponse.json({ status });
}

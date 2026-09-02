import { NextResponse, type NextRequest } from "next/server";
import { capturePaypalOrder } from "@/lib/paypal";
import { markOrderPaid } from "@/db/orders";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { paypalOrderId?: string };
  if (!body.paypalOrderId) return NextResponse.json({ error: "paypalOrderId is required" }, { status: 400 });

  const { status, customId } = await capturePaypalOrder(body.paypalOrderId);
  if (status === "COMPLETED" && customId) {
    await markOrderPaid(customId);
  }

  return NextResponse.json({ status });
}

import { NextResponse, type NextRequest } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";
import { getOrderWithItems, attachPaymentSession } from "@/db/orders";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { orderId?: string };
  if (!body.orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const result = await getOrderWithItems(body.orderId);
  if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { order } = result;

  const paypalOrderId = await createPaypalOrder({ orderId: order.id, totalCents: order.totalCents, currency: order.currency });
  await attachPaymentSession(order.id, "paypal", paypalOrderId);

  return NextResponse.json({ paypalOrderId });
}

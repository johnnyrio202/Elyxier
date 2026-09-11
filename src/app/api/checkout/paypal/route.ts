import { NextResponse, type NextRequest } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";
import { getOrderWithItems, attachPaymentSession } from "@/db/orders";
import { getCustomerById } from "@/db/customers";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { orderId?: string };
  if (!body.orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const result = await getOrderWithItems(body.orderId);
  if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { order } = result;

  // For a signed-in customer with a saved address, prefill and lock it into
  // the PayPal popup so they don't have to pick/re-enter one there.
  const customer = order.customerId ? await getCustomerById(order.customerId) : null;

  const paypalOrderId = await createPaypalOrder({
    orderId: order.id,
    totalCents: order.totalCents,
    currency: order.currency,
    shippingAddress: customer?.shippingAddress,
  });
  await attachPaymentSession(order.id, "paypal", paypalOrderId);

  return NextResponse.json({ paypalOrderId });
}

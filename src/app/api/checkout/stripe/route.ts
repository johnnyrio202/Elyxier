import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrderWithItems, attachPaymentSession } from "@/db/orders";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { orderId?: string; successUrl?: string; cancelUrl?: string };
  if (!body.orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const result = await getOrderWithItems(body.orderId);
  if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { order, items } = result;

  const origin = req.nextUrl.origin;
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: order.currency,
        product_data: { name: item.productName },
        unit_amount: item.unitPriceCents,
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: body.successUrl ?? `${origin}/order/success?orderId=${order.id}`,
    cancel_url: body.cancelUrl ?? `${origin}/order/canceled?orderId=${order.id}`,
  });

  await attachPaymentSession(order.id, "stripe", session.id);
  return NextResponse.json({ url: session.url });
}

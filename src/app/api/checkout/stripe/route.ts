import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrderWithItems, attachPaymentSession } from "@/db/orders";
import { getCustomerById, attachStripeCustomerId } from "@/db/customers";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { orderId?: string; successUrl?: string; cancelUrl?: string };
  if (!body.orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const result = await getOrderWithItems(body.orderId);
  if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { order, items } = result;

  // For a signed-in customer, reuse (or create) a Stripe Customer so Stripe
  // remembers their shipping address/email for next time — this is what
  // makes an account actually save a repeat customer re-typing everything.
  let stripeCustomerId: string | undefined;
  if (order.customerId) {
    const customer = await getCustomerById(order.customerId);
    if (customer) {
      stripeCustomerId = customer.stripeCustomerId ?? undefined;
      if (!stripeCustomerId) {
        const created = await getStripe().customers.create({
          email: customer.email ?? undefined,
          name: customer.name ?? undefined,
          metadata: { customerId: customer.id },
        });
        stripeCustomerId = created.id;
        await attachStripeCustomerId(customer.id, stripeCustomerId);
      }
    }
  }

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
    customer: stripeCustomerId,
    // Saves the shipping/billing details entered on this session back onto
    // the Stripe Customer, so a signed-in repeat customer gets them prefilled.
    customer_update: stripeCustomerId ? { shipping: "auto", address: "auto" } : undefined,
    // Required to ship a physical product — collected on Stripe's hosted page,
    // read back in the webhook once payment completes.
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: true },
    // A fixed rate shown as its own line on Stripe's page — order.shippingCents
    // was already computed once at order-creation time (src/db/orders.ts), so
    // this always matches what's on the order rather than being recalculated.
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: order.shippingCents, currency: order.currency },
          display_name: order.shippingCents === 0 ? "Free shipping" : "Shipping",
        },
      },
    ],
    success_url: body.successUrl ?? `${origin}/order/success?orderId=${order.id}`,
    cancel_url: body.cancelUrl ?? `${origin}/order/canceled?orderId=${order.id}`,
  });

  await attachPaymentSession(order.id, "stripe", session.id);
  return NextResponse.json({ url: session.url });
}

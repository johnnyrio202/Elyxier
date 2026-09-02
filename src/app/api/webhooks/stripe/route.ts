import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid } from "@/db/orders";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not set" }, { status: 500 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await markOrderPaid(orderId);
  }

  return NextResponse.json({ received: true });
}

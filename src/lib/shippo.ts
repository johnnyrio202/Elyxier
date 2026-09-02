import "server-only";
import type { ShippingAddress } from "@/db/orders";

// No official Vercel Marketplace integration exists for Shippo, so this talks
// to its REST API directly (same pattern as src/lib/paypal.ts).
//
// Semi-automated fulfillment: we push each paid order into Shippo as an
// "Order" object so it shows up in the client's Shippo dashboard. She picks a
// rate and buys the label herself there — we don't purchase labels via API.
// See src/app/api/webhooks/shippo/route.ts for how the resulting tracking
// info flows back to us once she does.
const SHIPPO_API_BASE = "https://api.goshippo.com";

function authHeader() {
  const token = process.env.SHIPPO_API_TOKEN;
  if (!token) throw new Error("SHIPPO_API_TOKEN is not set");
  return { Authorization: `ShippoToken ${token}` };
}

export async function pushOrderToShippo(input: {
  orderId: string;
  shippingAddress: ShippingAddress;
  customerEmail: string | null;
  items: { name: string; slug: string; unitPriceCents: number; quantity: number }[];
  totalCents: number;
  currency: string;
  totalWeightOz: number;
}): Promise<string> {
  const res = await fetch(`${SHIPPO_API_BASE}/orders/`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      order_number: input.orderId,
      order_status: "PAID",
      placed_at: new Date().toISOString(),
      to_address: {
        name: input.shippingAddress.name,
        street1: input.shippingAddress.line1,
        street2: input.shippingAddress.line2 ?? "",
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        zip: input.shippingAddress.postalCode,
        country: input.shippingAddress.country,
        phone: input.shippingAddress.phone ?? "",
        email: input.customerEmail ?? "",
      },
      line_items: input.items.map((item) => ({
        title: item.name,
        sku: item.slug,
        quantity: item.quantity,
        total_price: ((item.unitPriceCents * item.quantity) / 100).toFixed(2),
        currency: input.currency.toUpperCase(),
      })),
      shipping_cost: "0.00",
      shipping_cost_currency: input.currency.toUpperCase(),
      shipping_method: "Standard",
      subtotal_price: (input.totalCents / 100).toFixed(2),
      total_price: (input.totalCents / 100).toFixed(2),
      total_tax: "0.00",
      currency: input.currency.toUpperCase(),
      weight: input.totalWeightOz.toString(),
      weight_unit: "oz",
    }),
  });
  if (!res.ok) throw new Error(`Shippo order creation failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { object_id: string };
  return json.object_id;
}

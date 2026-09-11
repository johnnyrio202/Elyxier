import "server-only";
import type { ShippingAddress } from "@/db/orders";

// No official Vercel Marketplace integration exists for PayPal, so this talks
// to PayPal's REST API directly. Defaults to the sandbox base URL — set
// PAYPAL_API_BASE to https://api-m.paypal.com to go live.
function apiBase(): string {
  return process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set");

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function createPaypalOrder(input: {
  orderId: string;
  totalCents: number;
  currency: string;
  shippingAddress?: ShippingAddress | null;
}): Promise<string> {
  const token = await getAccessToken();
  const shipping = input.shippingAddress;

  const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.orderId,
          amount: {
            currency_code: input.currency.toUpperCase(),
            value: (input.totalCents / 100).toFixed(2),
          },
          // Prefills the buyer's saved address into the PayPal popup instead
          // of them re-typing it — paired with SET_PROVIDED_ADDRESS below,
          // which is what tells PayPal to actually use it rather than treat
          // it as a mere suggestion.
          ...(shipping
            ? {
                shipping: {
                  name: { full_name: shipping.name },
                  address: {
                    address_line_1: shipping.line1,
                    address_line_2: shipping.line2 ?? undefined,
                    admin_area_2: shipping.city,
                    admin_area_1: shipping.state,
                    postal_code: shipping.postalCode,
                    country_code: shipping.country,
                  },
                },
              }
            : {}),
        },
      ],
      ...(shipping
        ? { payment_source: { paypal: { experience_context: { shipping_preference: "SET_PROVIDED_ADDRESS" } } } }
        : {}),
    }),
  });
  if (!res.ok) throw new Error(`PayPal create order failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { id: string };
  return json.id;
}

export async function capturePaypalOrder(
  paypalOrderId: string
): Promise<{ status: string; customId: string | null; shippingAddress: ShippingAddress | null }> {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`PayPal capture failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as {
    status: string;
    purchase_units?: {
      custom_id?: string;
      shipping?: {
        name?: { full_name?: string };
        address?: {
          address_line_1?: string;
          address_line_2?: string;
          admin_area_2?: string;
          admin_area_1?: string;
          postal_code?: string;
          country_code?: string;
        };
      };
    }[];
  };

  const shipping = json.purchase_units?.[0]?.shipping;
  const shippingAddress: ShippingAddress | null =
    shipping?.address && shipping.name?.full_name
      ? {
          name: shipping.name.full_name,
          line1: shipping.address.address_line_1 ?? "",
          line2: shipping.address.address_line_2 ?? null,
          city: shipping.address.admin_area_2 ?? "",
          state: shipping.address.admin_area_1 ?? "",
          postalCode: shipping.address.postal_code ?? "",
          country: shipping.address.country_code ?? "",
        }
      : null;

  return { status: json.status, customId: json.purchase_units?.[0]?.custom_id ?? null, shippingAddress };
}

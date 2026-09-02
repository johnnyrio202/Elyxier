import "server-only";

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

export async function createPaypalOrder(input: { orderId: string; totalCents: number; currency: string }): Promise<string> {
  const token = await getAccessToken();
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
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`PayPal create order failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { id: string };
  return json.id;
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<{ status: string; customId: string | null }> {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`PayPal capture failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as {
    status: string;
    purchase_units?: { custom_id?: string }[];
  };
  return { status: json.status, customId: json.purchase_units?.[0]?.custom_id ?? null };
}

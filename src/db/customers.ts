import "server-only";
import { getSql } from "./client";
import type { ShippingAddress } from "./orders";

const CUSTOMER_COLUMNS = "id, clerk_user_id, email, name, phone, stripe_customer_id, shipping_address";

export type Customer = {
  id: string;
  clerkUserId: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  stripeCustomerId: string | null;
  shippingAddress: ShippingAddress | null;
};

function mapRow(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    clerkUserId: row.clerk_user_id as string,
    email: (row.email as string | null) ?? null,
    name: (row.name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    stripeCustomerId: (row.stripe_customer_id as string | null) ?? null,
    shippingAddress: (row.shipping_address as ShippingAddress | null) ?? null,
  };
}

// Lazy upsert: no separate Clerk webhook sync needed since we already have
// the session's email/name at the moment a signed-in user checks out.
export async function getOrCreateCustomerByClerkId(
  clerkUserId: string,
  info: { email?: string | null; name?: string | null }
): Promise<Customer> {
  const sql = getSql();
  const [row] = (await sql`
    INSERT INTO customers (clerk_user_id, email, name)
    VALUES (${clerkUserId}, ${info.email ?? null}, ${info.name ?? null})
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, customers.email),
      name = COALESCE(EXCLUDED.name, customers.name),
      updated_at = now()
    RETURNING id, clerk_user_id, email, name, phone, stripe_customer_id, shipping_address
  `) as Record<string, unknown>[];
  return mapRow(row);
}

export async function getCustomerByClerkId(clerkUserId: string): Promise<Customer | null> {
  const sql = getSql();
  const [row] = (await sql.query(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE clerk_user_id = $1`, [
    clerkUserId,
  ])) as Record<string, unknown>[];
  return row ? mapRow(row) : null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const sql = getSql();
  const [row] = (await sql.query(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE id = $1`, [id])) as Record<
    string,
    unknown
  >[];
  return row ? mapRow(row) : null;
}

// Self-service save from the account page — separate from
// getOrCreateCustomerByClerkId's checkout-time upsert so a customer can set
// up their profile (including a default shipping address) before ever
// placing an order.
export async function updateCustomerProfile(
  clerkUserId: string,
  info: { email: string | null; name: string | null; phone: string | null; shippingAddress: ShippingAddress | null }
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO customers (clerk_user_id, email, name, phone, shipping_address)
    VALUES (${clerkUserId}, ${info.email}, ${info.name}, ${info.phone}, ${info.shippingAddress ? JSON.stringify(info.shippingAddress) : null}::jsonb)
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      email = COALESCE(EXCLUDED.email, customers.email),
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      shipping_address = EXCLUDED.shipping_address,
      updated_at = now()
  `;
}

export async function attachStripeCustomerId(customerId: string, stripeCustomerId: string): Promise<void> {
  const sql = getSql();
  await sql`UPDATE customers SET stripe_customer_id = ${stripeCustomerId}, updated_at = now() WHERE id = ${customerId}`;
}

export type CustomerOrderSummary = {
  id: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: { productName: string; quantity: number; unitPriceCents: number }[];
  tracking: { carrier: string | null; trackingNumber: string | null; trackingUrl: string | null; status: string } | null;
  shippingAddress: ShippingAddress | null;
};

export async function getCustomerOrders(customerId: string): Promise<CustomerOrderSummary[]> {
  const sql = getSql();
  const orderRows = (await sql`
    SELECT id, payment_status, fulfillment_status, total_cents, currency, created_at, shipping_address
    FROM orders WHERE customer_id = ${customerId} ORDER BY created_at DESC
  `) as Record<string, unknown>[];

  const orders: CustomerOrderSummary[] = [];
  for (const row of orderRows) {
    const orderId = row.id as string;
    const itemRows = (await sql`
      SELECT product_name, quantity, unit_price_cents FROM order_items WHERE order_id = ${orderId}
    `) as Record<string, unknown>[];
    const [fulfillmentRow] = (await sql`
      SELECT carrier, tracking_number, tracking_url, status FROM fulfillments WHERE order_id = ${orderId}
    `) as Record<string, unknown>[];

    orders.push({
      id: orderId,
      paymentStatus: row.payment_status as string,
      fulfillmentStatus: row.fulfillment_status as string,
      totalCents: Number(row.total_cents),
      currency: row.currency as string,
      createdAt: (row.created_at as Date).toString(),
      items: itemRows.map((i) => ({
        productName: i.product_name as string,
        quantity: Number(i.quantity),
        unitPriceCents: Number(i.unit_price_cents),
      })),
      tracking: fulfillmentRow
        ? {
            carrier: (fulfillmentRow.carrier as string | null) ?? null,
            trackingNumber: (fulfillmentRow.tracking_number as string | null) ?? null,
            trackingUrl: (fulfillmentRow.tracking_url as string | null) ?? null,
            status: fulfillmentRow.status as string,
          }
        : null,
      shippingAddress: (row.shipping_address as ShippingAddress | null) ?? null,
    });
  }
  return orders;
}

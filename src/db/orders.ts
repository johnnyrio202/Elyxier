import "server-only";
import { getSql } from "./client";
import { decrementInventory } from "./products";
import { getShippingSettings, computeShippingCents } from "./shipping";

export type OrderItemInput = { slug: string; name: string; unitPriceCents: number; quantity: number };

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
};

export type Order = {
  id: string;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "canceled";
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: ShippingAddress | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  paymentProvider: "stripe" | "paypal" | null;
  providerReference: string | null;
  shippoOrderId: string | null;
};

export type OrderItem = { productSlug: string; productName: string; unitPriceCents: number; quantity: number };

const ORDER_COLUMNS = `
  id, payment_status, fulfillment_status, customer_id, customer_name, customer_email, customer_phone,
  shipping_address, subtotal_cents, shipping_cents, total_cents, currency, payment_provider, provider_reference, shippo_order_id
`;

export async function createOrder(input: {
  items: OrderItemInput[];
  customer?: { name?: string; email?: string; phone?: string };
  customerId?: string;
  source?: string;
}): Promise<Order> {
  const sql = getSql();
  const subtotalCents = input.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const shippingSettings = await getShippingSettings();
  const shippingCents = computeShippingCents(subtotalCents, shippingSettings);
  const totalCents = subtotalCents + shippingCents;

  const [orderRow] = (await sql.query(
    `INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, subtotal_cents, shipping_cents, total_cents, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${ORDER_COLUMNS}`,
    [
      input.customerId ?? null,
      input.customer?.name ?? null,
      input.customer?.email ?? null,
      input.customer?.phone ?? null,
      subtotalCents,
      shippingCents,
      totalCents,
      input.source ?? null,
    ]
  )) as Record<string, unknown>[];

  for (const item of input.items) {
    await sql`
      INSERT INTO order_items (order_id, product_slug, product_name, unit_price_cents, quantity)
      VALUES (${orderRow.id as string}, ${item.slug}, ${item.name}, ${item.unitPriceCents}, ${item.quantity})
    `;
  }

  return mapOrder(orderRow);
}

export async function getOrderWithItems(orderId: string): Promise<{ order: Order; items: OrderItem[] } | null> {
  const sql = getSql();
  const orderRows = (await sql.query(`SELECT ${ORDER_COLUMNS} FROM orders WHERE id = $1`, [orderId])) as Record<string, unknown>[];
  if (!orderRows[0]) return null;

  const itemRows = (await sql`
    SELECT product_slug, product_name, unit_price_cents, quantity FROM order_items WHERE order_id = ${orderId}
  `) as Record<string, unknown>[];

  return {
    order: mapOrder(orderRows[0]),
    items: itemRows.map((r) => ({
      productSlug: r.product_slug as string,
      productName: r.product_name as string,
      unitPriceCents: Number(r.unit_price_cents),
      quantity: Number(r.quantity),
    })),
  };
}

export async function attachPaymentSession(
  orderId: string,
  provider: "stripe" | "paypal",
  reference: string
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE orders SET payment_provider = ${provider}, provider_reference = ${reference}, updated_at = now()
    WHERE id = ${orderId}
  `;
}

// Idempotent: safe to call more than once for the same order (e.g. a retried
// webhook) — returns false (and does nothing further) if already paid.
// Customer/shipping details are optional since PayPal capture doesn't hand
// them back the way Stripe Checkout does.
export async function markOrderPaid(
  orderId: string,
  details?: { customer?: { name?: string; email?: string; phone?: string }; shippingAddress?: ShippingAddress }
): Promise<boolean> {
  const sql = getSql();
  const [row] = (await sql.query(
    `UPDATE orders SET
       payment_status = 'paid',
       updated_at = now(),
       customer_name = COALESCE($2, customer_name),
       customer_email = COALESCE($3, customer_email),
       customer_phone = COALESCE($4, customer_phone),
       shipping_address = COALESCE($5::jsonb, shipping_address)
     WHERE id = $1 AND payment_status != 'paid'
     RETURNING id`,
    [
      orderId,
      details?.customer?.name ?? null,
      details?.customer?.email ?? null,
      details?.customer?.phone ?? null,
      details?.shippingAddress ? JSON.stringify(details.shippingAddress) : null,
    ]
  )) as Record<string, unknown>[];
  if (!row) return false; // already paid (or missing) — nothing further to do

  const itemRows = (await sql`
    SELECT product_slug, quantity FROM order_items WHERE order_id = ${orderId}
  `) as Record<string, unknown>[];
  for (const item of itemRows) {
    await decrementInventory(item.product_slug as string, Number(item.quantity));
  }
  return true;
}

export async function attachShippoOrderId(orderId: string, shippoOrderId: string): Promise<void> {
  const sql = getSql();
  await sql`UPDATE orders SET shippo_order_id = ${shippoOrderId}, updated_at = now() WHERE id = ${orderId}`;
}

export async function markOrderFulfilled(orderId: string): Promise<void> {
  const sql = getSql();
  await sql`UPDATE orders SET fulfillment_status = 'fulfilled', updated_at = now() WHERE id = ${orderId}`;
}

export async function findOrderIdByProviderReference(reference: string): Promise<string | null> {
  const sql = getSql();
  const [row] = (await sql`SELECT id FROM orders WHERE provider_reference = ${reference}`) as Record<string, unknown>[];
  return (row?.id as string) ?? null;
}

export async function findOrderIdByShippoOrderId(shippoOrderId: string): Promise<string | null> {
  const sql = getSql();
  const [row] = (await sql`SELECT id FROM orders WHERE shippo_order_id = ${shippoOrderId}`) as Record<string, unknown>[];
  return (row?.id as string) ?? null;
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    paymentStatus: row.payment_status as Order["paymentStatus"],
    fulfillmentStatus: row.fulfillment_status as Order["fulfillmentStatus"],
    customerId: (row.customer_id as string | null) ?? null,
    customerName: (row.customer_name as string | null) ?? null,
    customerEmail: (row.customer_email as string | null) ?? null,
    customerPhone: (row.customer_phone as string | null) ?? null,
    shippingAddress: (row.shipping_address as ShippingAddress | null) ?? null,
    subtotalCents: Number(row.subtotal_cents),
    shippingCents: Number(row.shipping_cents),
    totalCents: Number(row.total_cents),
    currency: row.currency as string,
    paymentProvider: (row.payment_provider as Order["paymentProvider"]) ?? null,
    providerReference: (row.provider_reference as string | null) ?? null,
    shippoOrderId: (row.shippo_order_id as string | null) ?? null,
  };
}

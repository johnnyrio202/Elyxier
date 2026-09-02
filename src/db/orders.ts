import "server-only";
import { getSql } from "./client";
import { decrementInventory } from "./products";

export type OrderItemInput = { slug: string; name: string; unitPriceCents: number; quantity: number };

export type Order = {
  id: string;
  status: "pending" | "paid" | "failed" | "canceled";
  subtotalCents: number;
  totalCents: number;
  currency: string;
  paymentProvider: "stripe" | "paypal" | null;
  providerReference: string | null;
};

export type OrderItem = { productSlug: string; productName: string; unitPriceCents: number; quantity: number };

export async function createOrder(input: {
  items: OrderItemInput[];
  customer?: { name?: string; email?: string; phone?: string };
  source?: string;
}): Promise<Order> {
  const sql = getSql();
  const subtotalCents = input.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  const [orderRow] = (await sql`
    INSERT INTO orders (customer_name, customer_email, customer_phone, subtotal_cents, total_cents, source)
    VALUES (${input.customer?.name ?? null}, ${input.customer?.email ?? null}, ${input.customer?.phone ?? null}, ${subtotalCents}, ${subtotalCents}, ${input.source ?? null})
    RETURNING id, status, subtotal_cents, total_cents, currency, payment_provider, provider_reference
  `) as Record<string, unknown>[];

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
  const orderRows = (await sql`
    SELECT id, status, subtotal_cents, total_cents, currency, payment_provider, provider_reference
    FROM orders WHERE id = ${orderId}
  `) as Record<string, unknown>[];
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

// Idempotent: safe to call more than once for the same order (e.g. a retried webhook).
export async function markOrderPaid(orderId: string): Promise<void> {
  const sql = getSql();
  const [row] = (await sql`
    UPDATE orders SET status = 'paid', updated_at = now()
    WHERE id = ${orderId} AND status != 'paid'
    RETURNING id
  `) as Record<string, unknown>[];
  if (!row) return; // already paid (or missing) — nothing further to do

  const itemRows = (await sql`
    SELECT product_slug, quantity FROM order_items WHERE order_id = ${orderId}
  `) as Record<string, unknown>[];
  for (const item of itemRows) {
    await decrementInventory(item.product_slug as string, Number(item.quantity));
  }
}

export async function findOrderIdByProviderReference(reference: string): Promise<string | null> {
  const sql = getSql();
  const [row] = (await sql`SELECT id FROM orders WHERE provider_reference = ${reference}`) as Record<string, unknown>[];
  return (row?.id as string) ?? null;
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    status: row.status as Order["status"],
    subtotalCents: Number(row.subtotal_cents),
    totalCents: Number(row.total_cents),
    currency: row.currency as string,
    paymentProvider: (row.payment_provider as Order["paymentProvider"]) ?? null,
    providerReference: (row.provider_reference as string | null) ?? null,
  };
}

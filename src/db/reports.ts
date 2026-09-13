import "server-only";
import { getSql } from "./client";

export type SalesSummary = {
  orderCount: number;
  revenueCents: number;
  discountCents: number;
  avgOrderValueCents: number;
};

export type TopProduct = {
  slug: string;
  name: string;
  unitsSold: number;
  revenueCents: number;
};

export type OrderSummaryRow = {
  id: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  customerName: string | null;
  customerEmail: string | null;
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  discountCode: string | null;
  discountCents: number;
  totalCents: number;
  currency: string;
  paymentProvider: string | null;
  source: string | null;
  createdAt: string;
};

async function getSalesSummarySince(since: Date | null): Promise<SalesSummary> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT COUNT(*)::int AS order_count, COALESCE(SUM(total_cents), 0)::int AS revenue_cents, COALESCE(SUM(discount_cents), 0)::int AS discount_cents
     FROM orders
     WHERE payment_status = 'paid' AND ($1::timestamptz IS NULL OR created_at >= $1)`,
    [since ? since.toISOString() : null]
  )) as Record<string, unknown>[];
  const row = rows[0];
  const orderCount = Number(row.order_count);
  const revenueCents = Number(row.revenue_cents);
  return {
    orderCount,
    revenueCents,
    discountCents: Number(row.discount_cents),
    avgOrderValueCents: orderCount > 0 ? Math.round(revenueCents / orderCount) : 0,
  };
}

// Paid orders only — a pending/failed order was never actually a sale.
export async function getSalesSummary(): Promise<{ allTime: SalesSummary; last30Days: SalesSummary }> {
  const [allTime, last30Days] = await Promise.all([
    getSalesSummarySince(null),
    getSalesSummarySince(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
  ]);
  return { allTime, last30Days };
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT oi.product_slug, oi.product_name, SUM(oi.quantity)::int AS units, SUM(oi.unit_price_cents * oi.quantity)::int AS revenue_cents
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.payment_status = 'paid'
     GROUP BY oi.product_slug, oi.product_name
     ORDER BY revenue_cents DESC
     LIMIT $1`,
    [limit]
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    slug: r.product_slug as string,
    name: r.product_name as string,
    unitsSold: Number(r.units),
    revenueCents: Number(r.revenue_cents),
  }));
}

// Every order regardless of status, newest first — pending/failed rows stay
// visible here (with their status shown) since a report that only shows
// successes hides the difference between "no orders" and "orders failing".
export async function listRecentOrders(limit = 200): Promise<OrderSummaryRow[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT o.id, o.payment_status, o.fulfillment_status, o.customer_name, o.customer_email,
            o.subtotal_cents, o.shipping_cents, o.discount_code, o.discount_cents, o.total_cents, o.currency,
            o.payment_provider, o.source, o.created_at,
            (SELECT COUNT(*)::int FROM order_items WHERE order_id = o.id) AS item_count
     FROM orders o
     ORDER BY o.created_at DESC
     LIMIT $1`,
    [limit]
  )) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as string,
    paymentStatus: r.payment_status as string,
    fulfillmentStatus: r.fulfillment_status as string,
    customerName: (r.customer_name as string | null) ?? null,
    customerEmail: (r.customer_email as string | null) ?? null,
    itemCount: Number(r.item_count),
    subtotalCents: Number(r.subtotal_cents),
    shippingCents: Number(r.shipping_cents),
    discountCode: (r.discount_code as string | null) ?? null,
    discountCents: Number(r.discount_cents ?? 0),
    totalCents: Number(r.total_cents),
    currency: r.currency as string,
    paymentProvider: (r.payment_provider as string | null) ?? null,
    source: (r.source as string | null) ?? null,
    createdAt: (r.created_at as Date).toISOString(),
  }));
}

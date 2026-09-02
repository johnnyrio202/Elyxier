import "server-only";
import { getSql } from "./client";

export type Fulfillment = {
  id: string;
  orderId: string;
  status: "awaiting_label" | "label_purchased" | "in_transit" | "delivered" | "failed";
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
};

export async function createFulfillment(orderId: string): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO fulfillments (order_id) VALUES (${orderId})
    ON CONFLICT (order_id) DO NOTHING
  `;
}

export async function getFulfillmentByOrderId(orderId: string): Promise<Fulfillment | null> {
  const sql = getSql();
  const [row] = (await sql`
    SELECT id, order_id, status, carrier, tracking_number, tracking_url, label_url
    FROM fulfillments WHERE order_id = ${orderId}
  `) as Record<string, unknown>[];
  return row ? mapRow(row) : null;
}

// Called once a label is purchased against the order (via Shippo's dashboard
// or API) — moves the fulfillment forward and records tracking details.
export async function recordLabelPurchased(
  orderId: string,
  input: { carrier: string; trackingNumber: string; trackingUrl: string; labelUrl: string }
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE fulfillments SET
      status = 'label_purchased',
      carrier = ${input.carrier},
      tracking_number = ${input.trackingNumber},
      tracking_url = ${input.trackingUrl},
      label_url = ${input.labelUrl},
      shipped_at = now(),
      updated_at = now()
    WHERE order_id = ${orderId}
  `;
}

export async function updateTrackingStatus(
  trackingNumber: string,
  status: "in_transit" | "delivered" | "failed"
): Promise<Fulfillment | null> {
  const sql = getSql();
  const [row] = (await sql`
    UPDATE fulfillments SET
      status = ${status},
      delivered_at = CASE WHEN ${status} = 'delivered' THEN now() ELSE delivered_at END,
      updated_at = now()
    WHERE tracking_number = ${trackingNumber}
    RETURNING id, order_id, status, carrier, tracking_number, tracking_url, label_url
  `) as Record<string, unknown>[];
  return row ? mapRow(row) : null;
}

function mapRow(row: Record<string, unknown>): Fulfillment {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    status: row.status as Fulfillment["status"],
    carrier: (row.carrier as string | null) ?? null,
    trackingNumber: (row.tracking_number as string | null) ?? null,
    trackingUrl: (row.tracking_url as string | null) ?? null,
    labelUrl: (row.label_url as string | null) ?? null,
  };
}

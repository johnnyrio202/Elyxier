import { NextResponse, type NextRequest } from "next/server";
import { findOrderIdByShippoOrderId, markOrderFulfilled, getOrderWithItems } from "@/db/orders";
import { recordLabelPurchased, updateTrackingStatus } from "@/db/fulfillments";
import { sendShippingConfirmationEmail } from "@/lib/email";

// Shippo doesn't sign webhook payloads, so this route is protected the same
// way src/app/api/revalidate/route.ts is: a shared secret in the URL, set
// when registering the webhook in the Shippo dashboard
// (…/api/webhooks/shippo?secret=...).
export async function POST(req: NextRequest) {
  const expectedSecret = process.env.SHIPPO_WEBHOOK_SECRET;
  if (!expectedSecret) return NextResponse.json({ error: "SHIPPO_WEBHOOK_SECRET is not set" }, { status: 500 });
  if (req.nextUrl.searchParams.get("secret") !== expectedSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const payload = (await req.json()) as { event?: string; data?: Record<string, unknown> };
  const data = payload.data ?? {};

  if (payload.event === "transaction_created" && data.status === "SUCCESS") {
    const shippoOrderId = data.order as string | undefined;
    if (!shippoOrderId) return NextResponse.json({ received: true });

    const orderId = await findOrderIdByShippoOrderId(shippoOrderId);
    if (!orderId) return NextResponse.json({ received: true });

    const rate = data.rate as { provider?: string } | undefined;
    const carrier = rate?.provider ?? "Carrier";
    const trackingNumber = (data.tracking_number as string) ?? "";
    const trackingUrl = (data.tracking_url_provider as string) ?? "";
    const labelUrl = (data.label_url as string) ?? "";

    await recordLabelPurchased(orderId, { carrier, trackingNumber, trackingUrl, labelUrl });
    await markOrderFulfilled(orderId);

    const result = await getOrderWithItems(orderId);
    if (result) {
      await sendShippingConfirmationEmail(result.order, { carrier, trackingNumber, trackingUrl });
    }
  }

  if (payload.event === "track_updated") {
    const trackingNumber = data.tracking_number as string | undefined;
    const trackingStatus = data.tracking_status as { status?: string } | undefined;
    if (trackingNumber && trackingStatus?.status) {
      const status =
        trackingStatus.status === "DELIVERED" ? "delivered" : trackingStatus.status === "TRANSIT" ? "in_transit" : trackingStatus.status === "FAILURE" || trackingStatus.status === "RETURNED" ? "failed" : null;
      if (status) await updateTrackingStatus(trackingNumber, status);
    }
  }

  return NextResponse.json({ received: true });
}

import "server-only";
import { getOrderWithItems, attachShippoOrderId } from "@/db/orders";
import { createFulfillment } from "@/db/fulfillments";
import { listCommerceProducts } from "@/db/products";
import { pushOrderToShippo } from "@/lib/shippo";
import { sendOrderConfirmationEmail, sendBusinessOrderNotification } from "@/lib/email";

// Called once per order, right after markOrderPaid() returns true (a fresh
// payment, not a retried webhook). Creates the fulfillment record, pushes the
// order to Shippo so the client can pick a rate and buy a label there, and
// sends confirmation emails. Best-effort: a failure here shouldn't fail the
// webhook response — Stripe/PayPal only care that we acknowledged payment.
export async function handleOrderPaid(orderId: string): Promise<void> {
  const result = await getOrderWithItems(orderId);
  if (!result) return;
  const { order, items } = result;

  await createFulfillment(orderId);

  if (order.shippingAddress) {
    try {
      const products = await listCommerceProducts();
      const weightBySlug = new Map(products.map((p) => [p.slug, p.weightOz]));
      const totalWeightOz = items.reduce((sum, i) => sum + (weightBySlug.get(i.productSlug) ?? 6) * i.quantity, 0);

      const shippoOrderId = await pushOrderToShippo({
        orderId: order.id,
        shippingAddress: order.shippingAddress,
        customerEmail: order.customerEmail,
        items: items.map((i) => ({ name: i.productName, slug: i.productSlug, unitPriceCents: i.unitPriceCents, quantity: i.quantity })),
        totalCents: order.totalCents,
        currency: order.currency,
        totalWeightOz,
      });
      await attachShippoOrderId(orderId, shippoOrderId);
    } catch (err) {
      console.error(`Failed to push order ${orderId} to Shippo`, err);
    }
  }

  try {
    await sendOrderConfirmationEmail(order, items);
    await sendBusinessOrderNotification(order, items);
  } catch (err) {
    console.error(`Failed to send order emails for ${orderId}`, err);
  }
}

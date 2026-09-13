import { NextResponse } from "next/server";
import { listRecentOrders } from "@/db/reports";

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const orders = await listRecentOrders(1000);
  const header = ["Date", "Customer Name", "Customer Email", "Items", "Subtotal", "Discount Code", "Discount", "Shipping", "Total", "Payment Status", "Payment Provider", "Fulfillment Status", "Source"];
  const rows = orders.map((o) => [
    o.createdAt,
    o.customerName ?? "",
    o.customerEmail ?? "",
    String(o.itemCount),
    (o.subtotalCents / 100).toFixed(2),
    o.discountCode ?? "",
    (o.discountCents / 100).toFixed(2),
    (o.shippingCents / 100).toFixed(2),
    (o.totalCents / 100).toFixed(2),
    o.paymentStatus,
    o.paymentProvider ?? "",
    o.fulfillmentStatus,
    o.source ?? "",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvField).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elyxier-orders.csv"`,
    },
  });
}

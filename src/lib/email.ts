import "server-only";
import { Resend } from "resend";
import type { Order, OrderItem } from "@/db/orders";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "ELYXIER <onboarding@resend.dev>";
}

async function send(to: string, subject: string, html: string) {
  await getResend().emails.send({ from: fromAddress(), to, subject, html });
}

function itemsListHtml(items: OrderItem[]): string {
  return items
    .map((i) => `<li>${i.quantity} × ${i.productName} — $${((i.unitPriceCents * i.quantity) / 100).toFixed(2)}</li>`)
    .join("");
}

function addressHtml(order: Order): string {
  const a = order.shippingAddress;
  if (!a) return "";
  return `<p>${a.name}<br>${a.line1}${a.line2 ? `<br>${a.line2}` : ""}<br>${a.city}, ${a.state} ${a.postalCode}<br>${a.country}</p>`;
}

export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]) {
  const html = `
    <h2>Thank you for your ELYXIER order ✦</h2>
    <p>Order total: $${(order.totalCents / 100).toFixed(2)}</p>
    <ul>${itemsListHtml(items)}</ul>
    <h3>Shipping to</h3>
    ${addressHtml(order)}
    <p>We'll send another email with tracking as soon as it ships.</p>
  `;
  if (order.customerEmail) await send(order.customerEmail, "Your ELYXIER order is confirmed", html);
}

export async function sendBusinessOrderNotification(order: Order, items: OrderItem[]) {
  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
  if (!businessEmail) return;
  const html = `
    <h2>New paid order — ${order.id}</h2>
    <p>Total: $${(order.totalCents / 100).toFixed(2)} via ${order.paymentProvider}</p>
    <ul>${itemsListHtml(items)}</ul>
    <h3>Ship to</h3>
    ${addressHtml(order)}
    <p>Buy the shipping label via Pirate Ship as usual.</p>
  `;
  await send(businessEmail, `New ELYXIER order — $${(order.totalCents / 100).toFixed(2)}`, html);
}

export async function sendContactFormEmail(input: { name: string; email: string; message: string }): Promise<void> {
  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
  if (!businessEmail) throw new Error("BUSINESS_NOTIFICATION_EMAIL is not set");
  const html = `
    <h2>New message from the website contact form</h2>
    <p><strong>From:</strong> ${input.name} &lt;${input.email}&gt;</p>
    <p>${input.message.replace(/\n/g, "<br>")}</p>
  `;
  await send(businessEmail, `Website contact form: ${input.name}`, html);
}

export async function sendShippingConfirmationEmail(
  order: Order,
  fulfillment: { carrier: string; trackingNumber: string; trackingUrl: string }
) {
  const html = `
    <h2>Your ELYXIER order is on its way ✦</h2>
    <p>Carrier: ${fulfillment.carrier}<br>Tracking number: ${fulfillment.trackingNumber}</p>
    <p><a href="${fulfillment.trackingUrl}">Track your package</a></p>
  `;
  if (order.customerEmail) await send(order.customerEmail, "Your ELYXIER order has shipped", html);
}

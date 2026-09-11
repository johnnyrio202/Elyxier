"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selector: string) => void; close?: () => void };
    };
  }
}

let sdkLoadPromise: Promise<void> | null = null;

function loadPaypalSdk(clientId: string): Promise<void> {
  if (window.paypal) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });
  return sdkLoadPromise;
}

export default function PayPalCheckoutButton({
  clientId,
  getOrderItems,
  source,
  onError,
}: {
  clientId: string;
  getOrderItems: () => { slug: string; quantity: number }[];
  source: string;
  onError: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPaypalSdk(clientId)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) onError();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    if (!ready || !window.paypal || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", label: "paypal" },
      createOrder: async () => {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: getOrderItems(), source }),
        });
        const orderJson = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderJson.error ?? "Could not create order");

        const ppRes = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderJson.order.id }),
        });
        const ppJson = await ppRes.json();
        if (!ppRes.ok) throw new Error(ppJson.error ?? "Could not start PayPal checkout");

        containerRef.current?.setAttribute("data-order-id", orderJson.order.id);
        return ppJson.paypalOrderId;
      },
      onApprove: async (data: { orderID: string }) => {
        const orderId = containerRef.current?.getAttribute("data-order-id");
        const res = await fetch("/api/checkout/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId: data.orderID }),
        });
        const json = await res.json();
        if (json.status === "COMPLETED") {
          window.location.href = `/order/success?orderId=${orderId}`;
        } else {
          onError();
        }
      },
      onError: () => onError(),
    });
    buttons.render(`#${containerRef.current.id}`);

    return () => {
      buttons.close?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return <div id="paypal-button-container" ref={containerRef} style={{ minHeight: ready ? undefined : 45 }} />;
}

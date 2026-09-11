// Pure, no "server-only" — the storefront cart preview needs the exact same
// rule the order-creation route uses (src/db/shipping.ts re-exports this),
// so the number shown before checkout always matches what's charged.
export type ShippingSettings = {
  flatRateCents: number;
  freeShippingThresholdCents: number | null;
};

export function computeShippingCents(subtotalCents: number, settings: ShippingSettings): number {
  if (settings.freeShippingThresholdCents != null && subtotalCents >= settings.freeShippingThresholdCents) {
    return 0;
  }
  return settings.flatRateCents;
}

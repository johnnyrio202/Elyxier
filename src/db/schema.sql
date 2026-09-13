-- ELYXIER commerce backend schema.
-- Products, orders, and leads live here (source of truth for commerce data).
-- Marketing content (name, description, photos) stays in Sanity — see src/lib/catalog.ts,
-- which joins the two by `slug`.

-- gen_random_uuid() is built into Postgres 13+ (Neon), no extension needed.

CREATE TABLE IF NOT EXISTS products (
  slug TEXT PRIMARY KEY,
  sku TEXT UNIQUE,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  inventory_count INTEGER NOT NULL DEFAULT 0 CHECK (inventory_count >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  -- Shipping weight, for building the Shippo order (see src/lib/shippo.ts).
  -- Defaults to a rough single-jar estimate until real per-product weights are on file.
  weight_oz INTEGER NOT NULL DEFAULT 6,
  -- Populated only if/when the client connects a Shopify store.
  shopify_product_id TEXT,
  shopify_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_oz INTEGER NOT NULL DEFAULT 6;

-- Discount: optional, applies to price_cents at read time (see
-- computeEffectivePrice in src/db/products.ts) rather than mutating
-- price_cents itself, so the original price is never lost.
-- discount_ends_at NULL means the discount runs until stopped or deleted.
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_type TEXT CHECK (discount_type IN ('percent', 'fixed'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_value INTEGER CHECK (discount_value > 0);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_starts_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_ends_at TIMESTAMPTZ;

-- A bundle is a row in `products` like any other (its own slug, price,
-- Sanity content) with is_bundle = true. Its inventory_count is not read
-- directly — availability is derived from its components' stock (see
-- listCommerceProducts), and a bundle sale decrements each component
-- instead of the bundle's own row (see decrementInventory).
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bundle BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS bundle_items (
  bundle_slug TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  component_slug TEXT NOT NULL REFERENCES products(slug),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  PRIMARY KEY (bundle_slug, component_slug)
);

-- Accounts are optional — guest checkout never creates a row here. A row is
-- lazily created the first time a signed-in Clerk user places an order.
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  phone TEXT,
  -- Populated on first checkout so Stripe can remember/prefill their
  -- shipping address and payment details on future orders.
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Split the way Shopify does: whether the customer paid and whether the
  -- order has shipped are independent facts with independent triggers.
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled', 'canceled')),
  -- Null for guest checkout — accounts are optional, never required to buy.
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paypal')),
  provider_reference TEXT,
  -- Which front-end direction the order came from (design-a..e), while that's still undecided.
  source TEXT,
  -- Populated once the paid order is pushed to Shippo for fulfillment.
  shippo_order_id TEXT,
  -- Populated only if/when the client connects a Shopify store.
  shopify_order_id TEXT,
  shopify_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'));
ALTER TABLE orders DROP COLUMN IF EXISTS status;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled', 'canceled'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shippo_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cents INTEGER NOT NULL DEFAULT 0;
-- A default address the customer can view/edit from their account page —
-- separate from any per-order shipping_address, which is a snapshot of
-- wherever that specific order actually shipped.
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Single-row settings table (the boolean PK + CHECK enforces exactly one row).
-- free_shipping_threshold_cents NULL means no free-shipping threshold applies.
CREATE TABLE IF NOT EXISTS shipping_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  flat_rate_cents INTEGER NOT NULL DEFAULT 500 CHECK (flat_rate_cents >= 0),
  free_shipping_threshold_cents INTEGER CHECK (free_shipping_threshold_cents > 0)
);
INSERT INTO shipping_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- Manually toggled by the client right when she actually goes live — this is
-- not a real stream integration, just an on/off flag that shows a pulsing
-- "LIVE NOW" badge linking out to the platform. See src/app/LiveBadges.tsx.
CREATE TABLE IF NOT EXISTS live_status (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  instagram_live BOOLEAN NOT NULL DEFAULT false,
  tiktok_live BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO live_status (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS orders_provider_reference_idx ON orders (provider_reference);
CREATE INDEX IF NOT EXISTS orders_shippo_order_id_idx ON orders (shippo_order_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL REFERENCES products(slug),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

-- One row per order (boutique-scale orders ship in a single package; a
-- multi-package model can be added later if that stops being true).
CREATE TABLE IF NOT EXISTS fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'awaiting_label' CHECK (status IN ('awaiting_label', 'label_purchased', 'in_transit', 'delivered', 'failed')),
  carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  label_url TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart-level promo codes (percent or fixed off the subtotal) — distinct from
-- the per-product sale discounts above, which apply automatically rather
-- than being entered at checkout. One code can be redeemed by many orders,
-- optionally capped by max_uses; used_count only increments once an order
-- actually pays (see markOrderPaid), not on creation, so abandoned carts
-- don't burn a redemption.
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER CHECK (max_uses > 0), -- null = unlimited
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ, -- null = never expires
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_cents INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

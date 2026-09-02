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

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

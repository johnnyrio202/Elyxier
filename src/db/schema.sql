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
  -- Populated only if/when the client connects a Shopify store.
  shopify_product_id TEXT,
  shopify_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  subtotal_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paypal')),
  provider_reference TEXT,
  -- Which front-end direction the order came from (design-a..e), while that's still undecided.
  source TEXT,
  -- Populated only if/when the client connects a Shopify store.
  shopify_order_id TEXT,
  shopify_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_provider_reference_idx ON orders (provider_reference);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL REFERENCES products(slug),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

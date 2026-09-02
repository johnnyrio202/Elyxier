import { NextResponse, type NextRequest } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { createOrder } from "@/db/orders";

type CartItem = { slug: string; quantity: number };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    items?: CartItem[];
    customer?: { name?: string; email?: string; phone?: string };
    source?: string;
  };

  if (!body.items?.length) {
    return NextResponse.json({ error: "items is required" }, { status: 400 });
  }

  // Prices and names always come from the catalog, never the client — a
  // request can only say which slugs and quantities it wants.
  const catalog = await getCatalog();
  const catalogBySlug = new Map(catalog.map((p) => [p.slug, p]));

  const orderItems = [];
  for (const item of body.items) {
    const product = catalogBySlug.get(item.slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${item.slug}` }, { status: 400 });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return NextResponse.json({ error: `Invalid quantity for ${item.slug}` }, { status: 400 });
    }
    if (!product.inStock || item.quantity > product.inventoryCount) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 409 });
    }
    orderItems.push({ slug: product.slug, name: product.name, unitPriceCents: product.priceCents, quantity: item.quantity });
  }

  const order = await createOrder({ items: orderItems, customer: body.customer, source: body.source });
  return NextResponse.json({ order });
}

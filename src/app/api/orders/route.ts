import { NextResponse, type NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCatalog } from "@/lib/catalog";
import { createOrder } from "@/db/orders";
import { getOrCreateCustomerByClerkId } from "@/db/customers";
import { getRedeemableDiscount, computeDiscountCents } from "@/db/discounts";

type CartItem = { slug: string; quantity: number };

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    items?: CartItem[];
    customer?: { name?: string; email?: string; phone?: string };
    source?: string;
    discountCode?: string;
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

  // Re-validate the code here rather than trusting the /api/discount-codes
  // preview the cart called earlier — that response is just advisory by the
  // time checkout actually happens.
  let discount: { code: string; cents: number } | undefined;
  if (body.discountCode) {
    const found = await getRedeemableDiscount(body.discountCode);
    if (!found) {
      return NextResponse.json({ error: "Discount code is no longer valid" }, { status: 400 });
    }
    const subtotalCents = orderItems.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
    discount = { code: found.code, cents: computeDiscountCents(subtotalCents, found) };
  }

  // Signed-in customers get their order linked to their account; guest
  // checkout (no session) is unaffected.
  const { userId } = await auth();
  let customerId: string | undefined;
  if (userId) {
    const user = await currentUser();
    const customer = await getOrCreateCustomerByClerkId(userId, {
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      name: user?.fullName ?? null,
    });
    customerId = customer.id;
  }

  const order = await createOrder({ items: orderItems, customer: body.customer, customerId, source: body.source, discount });
  return NextResponse.json({ order });
}

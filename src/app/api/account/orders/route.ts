import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCustomerByClerkId, getCustomerOrders } from "@/db/customers";

// Protected by src/middleware.ts — this only runs for a signed-in user.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customer = await getCustomerByClerkId(userId);
  if (!customer) return NextResponse.json({ orders: [] }); // no orders placed yet

  const orders = await getCustomerOrders(customer.id);
  return NextResponse.json({ orders });
}

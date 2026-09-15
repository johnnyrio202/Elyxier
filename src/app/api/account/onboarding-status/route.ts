import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isCustomerOnboarded } from "@/db/customers";

// Polled client-side after the in-page sign-in modal (see ElevatedGlamClient)
// completes, since that flow doesn't do a page navigation and so never hits
// the middleware's onboarding redirect.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ onboarded: false }, { status: 401 });

  const onboarded = await isCustomerOnboarded(userId);
  return NextResponse.json({ onboarded });
}

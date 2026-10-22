import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { isCustomerOnboarded } from "@/db/customers";

// Only /account and /api/account require sign-in. Everything else — the
// storefront, /api/checkout/*, /api/webhooks/* — stays open, since guest
// checkout is supported and Stripe/PayPal/Shippo call the webhook routes
// without a Clerk session.
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/api/account(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
// Routes a signed-in-but-not-yet-onboarded customer must still be able to
// reach: the onboarding form itself, auth pages, admin (separate cookie
// auth), and all API routes (redirecting a fetch/webhook call to an HTML
// page would break the caller instead of showing them anything).
const isOnboardingExempt = createRouteMatcher(["/onboarding(.*)", "/sign-in(.*)", "/sign-up(.*)", "/admin(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && req.nextUrl.pathname !== "/admin/login") {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await isValidAdminToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (!isOnboardingExempt(req)) {
    const { userId } = await auth();
    if (userId && !(await isCustomerOnboarded(userId))) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

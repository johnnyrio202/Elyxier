import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only /account and /api/account require sign-in. Everything else — the
// storefront, /api/checkout/*, /api/webhooks/* — stays open, since guest
// checkout is supported and Stripe/PayPal/Shippo call the webhook routes
// without a Clerk session.
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/api/account(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

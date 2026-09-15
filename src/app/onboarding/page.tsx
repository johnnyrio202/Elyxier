import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCustomerByClerkId } from "@/db/customers";
import { completeOnboarding } from "./actions";

const AMBER = "#D4920A";
const CARD = { border: `1px solid ${AMBER}33`, borderRadius: 8, padding: 24, background: "#141410" };
const INPUT_STYLE = {
  width: "100%",
  background: "#0A0A08",
  border: `1px solid ${AMBER}33`,
  borderRadius: 6,
  padding: "10px 12px",
  color: "#FAF7F0",
  fontSize: 14,
};
const LABEL_STYLE = { display: "block", fontSize: 12, color: "#9A8A70", marginBottom: 6 };

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, customer] = await Promise.all([currentUser(), getCustomerByClerkId(userId)]);
  if (customer?.onboardingCompletedAt) redirect("/account");

  const address = customer?.shippingAddress;
  const defaultName = customer?.name ?? user?.fullName ?? "";
  const defaultPhone = customer?.phone ?? "";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A08", color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
          One Last Step
        </p>
        <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>Complete Your Profile</h1>
        <p style={{ color: "#9A8A70", fontSize: 14, margin: "0 0 32px" }}>
          We need a few details to ship your orders and keep your account up to date.
        </p>

        <div style={CARD}>
          <form action={completeOnboarding} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Name</label>
                <input style={INPUT_STYLE} type="text" name="name" defaultValue={defaultName} required />
              </div>
              <div>
                <label style={LABEL_STYLE}>Phone</label>
                <input style={INPUT_STYLE} type="tel" name="phone" defaultValue={defaultPhone} required />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${AMBER}22`, paddingTop: 16, marginTop: 4 }}>
              <p style={{ ...LABEL_STYLE, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Default Shipping Address
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={LABEL_STYLE}>Full name</label>
                  <input style={INPUT_STYLE} type="text" name="shipName" defaultValue={address?.name ?? defaultName} required />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Address line 1</label>
                  <input style={INPUT_STYLE} type="text" name="shipLine1" defaultValue={address?.line1 ?? ""} required />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Address line 2 (optional)</label>
                  <input style={INPUT_STYLE} type="text" name="shipLine2" defaultValue={address?.line2 ?? ""} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>City</label>
                    <input style={INPUT_STYLE} type="text" name="shipCity" defaultValue={address?.city ?? ""} required />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>State</label>
                    <input style={INPUT_STYLE} type="text" name="shipState" defaultValue={address?.state ?? ""} required />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>ZIP</label>
                    <input style={INPUT_STYLE} type="text" name="shipPostalCode" defaultValue={address?.postalCode ?? ""} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Country</label>
                    <input style={INPUT_STYLE} type="text" name="shipCountry" defaultValue={address?.country ?? "US"} required />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Delivery phone (optional)</label>
                    <input style={INPUT_STYLE} type="tel" name="shipPhone" defaultValue={address?.phone ?? defaultPhone} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{ alignSelf: "flex-start", background: AMBER, color: "#0A0A08", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

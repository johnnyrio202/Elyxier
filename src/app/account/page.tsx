import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getCustomerByClerkId, getCustomerOrders, type CustomerOrderSummary } from "@/db/customers";
import type { ShippingAddress } from "@/db/orders";
import { saveProfile } from "./actions";

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

function statusLabel(order: CustomerOrderSummary): string {
  if (order.paymentStatus !== "paid") return order.paymentStatus;
  if (order.tracking?.status === "delivered") return "Delivered";
  if (order.tracking?.status === "in_transit") return "In transit";
  if (order.fulfillmentStatus === "fulfilled") return "Shipped";
  return "Preparing to ship";
}

function formatAddress(address: ShippingAddress): string {
  return [address.name, [address.line1, address.line2].filter(Boolean).join(", "), `${address.city}, ${address.state} ${address.postalCode}`, address.country]
    .filter(Boolean)
    .join(" · ");
}

export default async function AccountPage() {
  const { userId } = await auth();
  const customer = userId ? await getCustomerByClerkId(userId) : null;
  const orders = customer ? await getCustomerOrders(customer.id) : [];
  const address = customer?.shippingAddress;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A08", color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Your Account</p>
            <h1 style={{ fontSize: 32, margin: 0 }}>Profile & Orders</h1>
          </div>
          <UserButton />
        </div>

        <div style={{ ...CARD, marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 20px" }}>Profile</h2>
          <form action={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Name</label>
                <input style={INPUT_STYLE} type="text" name="name" defaultValue={customer?.name ?? ""} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Phone</label>
                <input style={INPUT_STYLE} type="tel" name="phone" defaultValue={customer?.phone ?? ""} />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${AMBER}22`, paddingTop: 16, marginTop: 4 }}>
              <p style={{ ...LABEL_STYLE, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Default Shipping Address
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={LABEL_STYLE}>Full name</label>
                  <input style={INPUT_STYLE} type="text" name="shipName" defaultValue={address?.name ?? ""} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Address line 1</label>
                  <input style={INPUT_STYLE} type="text" name="shipLine1" defaultValue={address?.line1 ?? ""} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Address line 2 (optional)</label>
                  <input style={INPUT_STYLE} type="text" name="shipLine2" defaultValue={address?.line2 ?? ""} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>City</label>
                    <input style={INPUT_STYLE} type="text" name="shipCity" defaultValue={address?.city ?? ""} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>State</label>
                    <input style={INPUT_STYLE} type="text" name="shipState" defaultValue={address?.state ?? ""} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>ZIP</label>
                    <input style={INPUT_STYLE} type="text" name="shipPostalCode" defaultValue={address?.postalCode ?? ""} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Country</label>
                    <input style={INPUT_STYLE} type="text" name="shipCountry" defaultValue={address?.country ?? "US"} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Delivery phone (optional)</label>
                    <input style={INPUT_STYLE} type="tel" name="shipPhone" defaultValue={address?.phone ?? ""} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{ alignSelf: "flex-start", background: AMBER, color: "#0A0A08", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}
            >
              Save Profile
            </button>
          </form>
        </div>

        <h2 style={{ fontSize: 22, margin: "0 0 20px" }}>Order History</h2>

        {orders.length === 0 ? (
          <p style={{ color: "#9A8A70" }}>No orders yet. Once you place one, it&apos;ll show up here with tracking.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} style={CARD}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "#9A8A70", fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: AMBER, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {statusLabel(order)}
                  </span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ fontSize: 14, color: "#FAF7F0", marginBottom: 4 }}>
                      {item.quantity} × {item.productName} — ${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}
                    </li>
                  ))}
                </ul>
                {order.shippingAddress && (
                  <p style={{ fontSize: 12, color: "#9A8A70", margin: "0 0 12px" }}>
                    Shipped to: {formatAddress(order.shippingAddress)}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700 }}>${(order.totalCents / 100).toFixed(2)}</span>
                  {order.tracking?.trackingUrl && (
                    <a href={order.tracking.trackingUrl} style={{ color: AMBER, fontSize: 13 }}>
                      Track package →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

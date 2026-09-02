import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getCustomerByClerkId, getCustomerOrders, type CustomerOrderSummary } from "@/db/customers";

const AMBER = "#D4920A";

function statusLabel(order: CustomerOrderSummary): string {
  if (order.paymentStatus !== "paid") return order.paymentStatus;
  if (order.tracking?.status === "delivered") return "Delivered";
  if (order.tracking?.status === "in_transit") return "In transit";
  if (order.fulfillmentStatus === "fulfilled") return "Shipped";
  return "Preparing to ship";
}

export default async function AccountPage() {
  const { userId } = await auth();
  const customer = userId ? await getCustomerByClerkId(userId) : null;
  const orders = customer ? await getCustomerOrders(customer.id) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A08", color: "#FAF7F0", fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ color: AMBER, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Your Account</p>
            <h1 style={{ fontSize: 32, margin: 0 }}>Order History</h1>
          </div>
          <UserButton />
        </div>

        {orders.length === 0 ? (
          <p style={{ color: "#9A8A70" }}>No orders yet. Once you place one, it&apos;ll show up here with tracking.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} style={{ border: `1px solid ${AMBER}33`, borderRadius: 8, padding: 20, background: "#141410" }}>
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

"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateCustomerProfile } from "@/db/customers";
import type { ShippingAddress } from "@/db/orders";

function readShippingAddress(formData: FormData): ShippingAddress | null {
  const name = String(formData.get("shipName") ?? "").trim();
  const line1 = String(formData.get("shipLine1") ?? "").trim();
  const city = String(formData.get("shipCity") ?? "").trim();
  const state = String(formData.get("shipState") ?? "").trim();
  const postalCode = String(formData.get("shipPostalCode") ?? "").trim();
  const country = String(formData.get("shipCountry") ?? "").trim();

  // Treat the address as unset unless every required field is filled in —
  // a half-filled address isn't useful for shipping and shouldn't be saved.
  if (!name || !line1 || !city || !state || !postalCode || !country) return null;

  const line2 = String(formData.get("shipLine2") ?? "").trim();
  const phone = String(formData.get("shipPhone") ?? "").trim();

  return {
    name,
    line1,
    line2: line2 || null,
    city,
    state,
    postalCode,
    country,
    phone: phone || null,
  };
}

export async function saveProfile(formData: FormData): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authorized");

  const user = await currentUser();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  await updateCustomerProfile(userId, {
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name: name || null,
    phone: phone || null,
    shippingAddress: readShippingAddress(formData),
  });

  revalidatePath("/account");
}

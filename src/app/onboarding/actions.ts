"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { completeCustomerOnboarding } from "@/db/customers";
import type { ShippingAddress } from "@/db/orders";

function readRequiredShippingAddress(formData: FormData): ShippingAddress {
  const name = String(formData.get("shipName") ?? "").trim();
  const line1 = String(formData.get("shipLine1") ?? "").trim();
  const city = String(formData.get("shipCity") ?? "").trim();
  const state = String(formData.get("shipState") ?? "").trim();
  const postalCode = String(formData.get("shipPostalCode") ?? "").trim();
  const country = String(formData.get("shipCountry") ?? "").trim();

  if (!name || !line1 || !city || !state || !postalCode || !country) {
    throw new Error("All shipping address fields are required.");
  }

  const line2 = String(formData.get("shipLine2") ?? "").trim();
  const phone = String(formData.get("shipPhone") ?? "").trim();

  return { name, line1, line2: line2 || null, city, state, postalCode, country, phone: phone || null };
}

export async function completeOnboarding(formData: FormData): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authorized");

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !phone) throw new Error("Name and phone are required.");

  const shippingAddress = readRequiredShippingAddress(formData);
  const user = await currentUser();

  await completeCustomerOnboarding(userId, {
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name,
    phone,
    shippingAddress,
  });

  redirect("/account");
}

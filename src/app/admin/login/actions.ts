"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminSessionToken, checkAdminPassword } from "@/lib/adminAuth";

export async function loginAdmin(_prevState: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    return "Incorrect password.";
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin/products");
}

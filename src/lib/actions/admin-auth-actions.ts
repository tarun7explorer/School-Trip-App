"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkAdminLoginRateLimit } from "@/lib/security/rate-limit";
import { getAdminAccess } from "@/lib/admin/auth";
import { adminLoginSchema } from "@/lib/validations/admin-login-schema";

const genericLoginError = "Unable to sign in with those details. Check your email and password, then try again.";

export async function signInAdmin(input: unknown): Promise<{ success: false; message: string }> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: genericLoginError };

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = requestHeaders.get("x-real-ip")?.trim() || forwardedFor || "unknown";
  const limit = await checkAdminLoginRateLimit(clientAddress, parsed.data.email);
  if (!limit.allowed) return { success: false, message: genericLoginError };

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { success: false, message: genericLoginError };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { success: false, message: genericLoginError };
  } catch {
    return { success: false, message: genericLoginError };
  }

  const access = await getAdminAccess(supabase);
  if (access.kind !== "authorized") {
    await supabase.auth.signOut();
    return { success: false, message: genericLoginError };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } finally {
    // Clear the complete SSR cookie set even if sign-out cannot reach Supabase.
    const cookieStore = await cookies();
    for (const cookie of cookieStore.getAll()) {
      if (cookie.name === "mb-learning-auth" || cookie.name.startsWith("mb-learning-auth.")) {
        cookieStore.delete(cookie.name);
      }
    }
    redirect("/admin/login");
  }
}

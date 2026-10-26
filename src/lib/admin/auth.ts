import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AdminClient = SupabaseClient<Database>;

export type AdminAccess =
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "unavailable" }
  | { kind: "authorized"; userId: string; email: string | null; supabase: AdminClient };

export class AdminAccessError extends Error {
  constructor(readonly kind: Exclude<AdminAccess["kind"], "authorized">) {
    super("Administrator access could not be verified.");
    this.name = "AdminAccessError";
  }
}

export async function getAdminAccess(client?: AdminClient): Promise<AdminAccess> {
  let supabase = client;
  if (!supabase) {
    try {
      supabase = await createSupabaseServerClient();
    } catch {
      return { kind: "unavailable" };
    }
  }

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string" || !userId) return { kind: "unauthenticated" };

  const { data: admin, error: membershipError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) return { kind: "unavailable" };
  if (!admin) return { kind: "forbidden" };

  const email = data.claims.email;
  return { kind: "authorized", userId, email: typeof email === "string" ? email : null, supabase };
}

export async function requireAdmin() {
  const access = await getAdminAccess();
  if (access.kind === "unauthenticated") redirect("/admin/login");
  if (access.kind === "forbidden") notFound();
  if (access.kind === "unavailable") throw new Error("Administrator access is temporarily unavailable.");
  return access;
}

export async function listAdminInterests() {
  const access = await getAdminAccess();
  if (access.kind !== "authorized") throw new AdminAccessError(access.kind);

  const { data, error } = await access.supabase
    .from("trip_interests")
    .select("id, teacher_name, school_name, email, phone, trip_slug, student_count, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load enquiries.");
  return data;
}

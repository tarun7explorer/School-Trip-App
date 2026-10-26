import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminAccess } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Administrator Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const access = await getAdminAccess();
  if (access.kind === "authorized") redirect("/admin");
  return <AdminLoginForm />;
}

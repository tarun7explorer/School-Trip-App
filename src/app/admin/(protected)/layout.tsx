import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/admin" aria-label="MB Learning admin dashboard">
          <span className="brand-mark"><BookOpenCheck size={19} aria-hidden="true" /></span>
          <span>MB <b>LEARNING</b></span>
        </Link>
        <div className="admin-header-actions">
          <span className="admin-user-email">{admin.email}</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}

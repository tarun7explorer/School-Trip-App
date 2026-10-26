import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, LayoutDashboard, MapPin } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/admin/auth";
import { trips } from "@/data/trips";

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
      <div className="admin-workspace">
        <aside className="admin-sidebar" aria-label="Administrator navigation">
          <div className="admin-sidebar-label">WORKSPACE</div>
          <nav>
            <Link className="admin-sidebar-link admin-sidebar-link-active" href="/admin" aria-current="page"><LayoutDashboard size={17} aria-hidden="true" /> Overview</Link>
          </nav>
          <div className="admin-sidebar-label admin-sidebar-destinations-label">DESTINATIONS</div>
          <nav aria-label="Filter by destination">
            {trips.map((trip) => (
              <Link className="admin-sidebar-link" href={`/admin?trip=${trip.slug}`} key={trip.slug}>
                <MapPin size={16} aria-hidden="true" /><span>{trip.city}</span><ArrowUpRight size={13} className="admin-sidebar-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <p className="admin-sidebar-note">Enquiry data is private and visible only to approved MB Learning administrators.</p>
        </aside>
        <div className="admin-workspace-content">{children}</div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="MB Learning home">
          <span className="brand-mark"><BookOpenCheck size={20} aria-hidden="true" /></span>
          <span>MB <b>LEARNING</b></span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/#trips">Trips</Link>
          <Link href="/#trips">Student Explore</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#about">About</Link>
        </nav>
        <div className="nav-actions">
          <Link className="admin-nav-link" href="/admin/login">Admin Login</Link>
          <Link className="button button-primary nav-cta" href="/interest">Register Interest</Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}

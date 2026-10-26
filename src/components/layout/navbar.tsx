import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="MB Learning home">
          <span className="brand-mark"><BookOpenCheck size={20} aria-hidden="true" /></span>
          <span>MB <b>LEARNING</b></span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/#trips">Trips</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#about">About</Link>
        </nav>
        <Link className="button button-primary nav-cta" href="/interest">
          Register Interest <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <MobileNav />
      </nav>
    </header>
  );
}

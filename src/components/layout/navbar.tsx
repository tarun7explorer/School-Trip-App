import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="MB Learning home">
          <span className="brand-mark"><BookOpenCheck size={20} aria-hidden="true" /></span>
          <span>MB <b>LEARNING</b></span>
        </Link>
        <div className="nav-links">
          <Link href="/#trips">Explore trips</Link>
          <Link href="/#approach">Our approach</Link>
        </div>
        <Link className="button button-primary nav-cta" href="/#trips">
          Find a trip <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}

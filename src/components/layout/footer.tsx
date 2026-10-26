import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" href="/" aria-label="MB Learning home">
            <span className="brand-mark"><BookOpenCheck size={19} aria-hidden="true" /></span>
            <span>MB <b>LEARNING</b></span>
          </Link>
          <p>Learning beyond the classroom starts with curiosity.</p>
        </div>
        <div className="footer-links-group">
          <span className="footer-heading">EXPLORE</span>
          <Link href="/#trips">Trip themes</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#about">Why educational travel</Link>
        </div>
        <div className="footer-links-group footer-next">
          <span className="footer-heading">GET STARTED</span>
          <Link href="/interest">Register school interest <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/#trips">Explore destinations <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="footer-bottom"><span>MB Learning · School Trip Interest Platform</span><Link href="#main">Back to top ↑</Link></div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark"><span aria-hidden="true">M</span></span>
          <span>MB <b>LEARNING</b></span>
        </Link>
        <p>Learning beyond the classroom starts with curiosity.</p>
        <span className="footer-note">School Trip Interest Platform</span>
      </div>
    </footer>
  );
}

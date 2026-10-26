import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false, follow: false } };

export default function NotFound() {
  return <main id="main" className="not-found" tabIndex={-1}><p className="eyebrow">PAGE NOT FOUND</p><h1>That path wandered off.</h1><p>The page you are looking for is not available.</p><Link href="/" className="button button-primary">Back to the homepage</Link></main>;
}

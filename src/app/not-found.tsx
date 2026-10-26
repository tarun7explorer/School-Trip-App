import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="not-found"><p className="eyebrow">PAGE NOT FOUND</p><h1>That path wandered off.</h1><p>The page you are looking for is not available.</p><Link href="/" className="button button-primary">Back to the homepage</Link></main>;
}

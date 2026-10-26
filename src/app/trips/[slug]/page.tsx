import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getTripBySlug, trips } from "@/data/trips";

type TripPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trips.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) return { title: "Trip not found" };
  return {
    title: `${trip.city} — ${trip.theme}`,
    description: trip.summary,
    robots: { index: true, follow: true },
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  return (
    <main id="main" className="detail-page">
      <div className="detail-wrap">
        <Link href="/#trips" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> All trip themes</Link>
        <div className={`detail-banner detail-${trip.slug}`}><span>AN ILLUSTRATIVE LEARNING THEME</span><strong>{trip.city}</strong></div>
        <p className="eyebrow detail-city">{trip.city.toUpperCase()}</p>
        <h1>{trip.theme}</h1>
        <p className="detail-lead">{trip.learningPurpose}</p>
        <div className="detail-content-grid">
          <section><p className="eyebrow">POSSIBLE AREAS TO EXPLORE</p><h2>Ideas for discovery</h2><ul className="highlight-list">{trip.sampleHighlights.map((highlight) => <li key={highlight}><Check size={17} aria-hidden="true" />{highlight}</li>)}</ul></section>
          <aside className="detail-aside"><span className="aside-number">A NOTE</span><p>These themes are illustrative starting points. Dates, venues, itinerary, access and programme details have not been confirmed.</p><Link href="/#trips" className="text-link">Explore other destinations <ArrowRight size={16} aria-hidden="true" /></Link></aside>
        </div>
      </div>
    </main>
  );
}

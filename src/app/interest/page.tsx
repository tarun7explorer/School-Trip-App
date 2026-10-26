import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getTripBySlug, trips } from "@/data/trips";
import { tripSlugs } from "@/types/trip";

type InterestPageProps = { searchParams: Promise<{ trip?: string }> };

export const metadata: Metadata = {
  title: "Register Interest",
  description: "Continue to the interest registration flow for an MB Learning school trip.",
  robots: { index: false, follow: false },
};

export default async function InterestPage({ searchParams }: InterestPageProps) {
  const { trip: selectedSlug } = await searchParams;
  const isValidSlug = tripSlugs.some((slug) => slug === selectedSlug);
  const selectedTrip = isValidSlug && selectedSlug ? getTripBySlug(selectedSlug) : undefined;

  return (
    <main id="main" className="interest-handoff-page">
      <div className="interest-handoff-card">
        <Link href={selectedTrip ? `/trips/${selectedTrip.slug}` : "/#trips"} className="back-link"><ArrowLeft size={15} aria-hidden="true" /> {selectedTrip ? `Back to ${selectedTrip.city}` : "All trip themes"}</Link>
        <p className="eyebrow">SCHOOL TRIP INTEREST</p>
        <h1>{selectedTrip ? "Your trip choice is ready." : "Choose a trip to get started."}</h1>
        {selectedTrip ? (
          <div className="selected-trip-summary">
            <span><Check size={16} aria-hidden="true" /></span>
            <div><p className="selected-trip-city">SELECTED DESTINATION</p><h2>{selectedTrip.city}</h2><p>{selectedTrip.theme}</p></div>
          </div>
        ) : (
          <div className="interest-trip-options">
            {trips.map((trip) => <Link key={trip.slug} href={`/interest?trip=${trip.slug}`}><span>{trip.city}</span>{trip.theme}<ArrowRight size={16} aria-hidden="true" /></Link>)}
          </div>
        )}
        <p className="interest-handoff-note">The enquiry form is not enabled yet, so no personal information has been collected. Your selected trip is carried forward here for the registration flow.</p>
        <Link className="button button-primary" href="/#trips">Explore all trip themes <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}

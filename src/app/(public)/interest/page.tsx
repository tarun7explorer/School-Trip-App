import type { Metadata } from "next";
import { InterestForm } from "@/components/forms/interest-form";
import { BackButton } from "@/components/layout/back-button";
import { getTripBySlug } from "@/data/trips";
import { isTripSlug } from "@/types/trip";

type InterestPageProps = { searchParams: Promise<{ trip?: string | string[] }> };

export const metadata: Metadata = {
  title: "Register School Trip Interest",
  description: "Share your school's interest in an MB Learning educational trip theme. Enquiry details are reviewed by authorized administrators.",
  alternates: { canonical: "/interest" },
  openGraph: {
    title: "Register School Trip Interest | MB Learning",
    description: "Tell MB Learning which school trip theme interests your school.",
    url: "/interest",
    type: "website",
    siteName: "MB Learning",
    locale: "en_IN",
  },
  robots: { index: false, follow: false },
};

export default async function InterestPage({ searchParams }: InterestPageProps) {
  const { trip: queryTrip } = await searchParams;
  const tripSlug = typeof queryTrip === "string" && isTripSlug(queryTrip) ? queryTrip : undefined;
  const selectedTrip = tripSlug ? getTripBySlug(tripSlug) : undefined;

  return (
    <main id="main" className="interest-page" tabIndex={-1}>
      <div className="interest-page-wrap">
        <BackButton fallbackHref={selectedTrip ? `/trips/${selectedTrip.slug}` : "/#trips"} label={selectedTrip ? `Back to ${selectedTrip.city}` : "Back to all trips"} />
        <header className="interest-page-heading">
          <p className="eyebrow">FOR TEACHERS & SCHOOL COORDINATORS</p>
          <h1>Register your school&apos;s interest.</h1>
          <p>Tell us who to contact, which learning theme interests your school and approximately how many students may take part.</p>
        </header>
        <InterestForm initialTripSlug={tripSlug} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InterestForm } from "@/components/forms/interest-form";
import { getTripBySlug } from "@/data/trips";
import { isTripSlug } from "@/types/trip";

type InterestPageProps = { searchParams: Promise<{ trip?: string | string[] }> };

export const metadata: Metadata = {
  title: "Register School Trip Interest",
  description: "Share your school's interest in an illustrative MB Learning educational trip theme.",
  robots: { index: false, follow: false },
};

export default async function InterestPage({ searchParams }: InterestPageProps) {
  const { trip: queryTrip } = await searchParams;
  const tripSlug = typeof queryTrip === "string" && isTripSlug(queryTrip) ? queryTrip : undefined;
  const selectedTrip = tripSlug ? getTripBySlug(tripSlug) : undefined;

  return (
    <main id="main" className="interest-page">
      <div className="interest-page-wrap">
        <Link href={selectedTrip ? `/trips/${selectedTrip.slug}` : "/#trips"} className="back-link"><ArrowLeft size={15} aria-hidden="true" /> {selectedTrip ? `Back to ${selectedTrip.city}` : "All trip themes"}</Link>
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTripBySlug, trips } from "@/data/trips";
import { TripDetail } from "@/components/trips/trip-detail";

type TripPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return trips.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) return { title: "Trip not found", robots: { index: false, follow: false } };

  return {
    title: `${trip.city} — ${trip.theme}`,
    description: trip.seoDescription,
    alternates: { canonical: `/trips/${trip.slug}` },
    openGraph: {
      title: `${trip.city} — ${trip.theme}`,
      description: trip.seoDescription,
      type: "article",
      url: `/trips/${trip.slug}`,
      images: [{ url: trip.image, alt: trip.imageAlt, width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.city} — ${trip.theme}`,
      description: trip.seoDescription,
      images: [{ url: trip.image, alt: trip.imageAlt }],
    },
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();
  return <TripDetail trip={trip} />;
}

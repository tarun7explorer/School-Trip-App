import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Trip } from "@/types/trip";

export function TripCard({ trip, index }: { trip: Trip; index: number }) {
  return (
    <Card className="trip-card">
      <Link href={`/trips/${trip.slug}`} className="trip-image-link" aria-label={`Explore ${trip.city}: ${trip.theme}`}>
        <div className="trip-image-wrap">
          <Image src={trip.image} alt={trip.imageAlt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" className="trip-image" />
          <span className="trip-number">0{index + 1} <span>/ 03</span></span>
        </div>
      </Link>
      <div className="trip-card-content">
        <p className="eyebrow trip-city">{trip.city}</p>
        <h3>{trip.theme}</h3>
        <p className="trip-summary">{trip.summary}</p>
        <div className="learning-outcome"><span>LEARNING FOCUS</span><p>{trip.learningPurpose}</p></div>
        <Link className="text-link" href={`/trips/${trip.slug}`}>
          Explore trip <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

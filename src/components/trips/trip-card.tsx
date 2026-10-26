import Link from "next/link";
import { ArrowUpRight, Compass, Landmark, Microscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Trip } from "@/types/trip";

const tripArt = {
  "hyderabad-stem": { icon: Microscope, label: "Curiosity in motion", className: "art-hyderabad", index: "01" },
  "jaipur-heritage": { icon: Landmark, label: "Stories in every detail", className: "art-jaipur", index: "02" },
  "delhi-discovery": { icon: Compass, label: "Ideas that shape a nation", className: "art-delhi", index: "03" },
} as const;

export function TripCard({ trip }: { trip: Trip }) {
  const art = tripArt[trip.slug];
  const Icon = art.icon;

  return (
    <Card className="trip-card">
      <div className={`trip-art ${art.className}`} aria-hidden="true">
        <span className="art-index">{art.index} / 03</span>
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <span className="art-icon"><Icon size={32} strokeWidth={1.5} /></span>
        <span className="art-caption">{art.label}</span>
      </div>
      <div className="trip-card-content">
        <p className="eyebrow">{trip.city}</p>
        <h3>{trip.theme}</h3>
        <p className="trip-summary">{trip.summary}</p>
        <Link className="text-link" href={`/trips/${trip.slug}`}>
          Explore this theme <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

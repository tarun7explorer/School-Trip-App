import { trips } from "@/data/trips";
import { TripCard } from "@/components/trips/trip-card";

export function TripSection() {
  return (
    <section className="trips-section section-wrap" id="trips" aria-labelledby="trips-title">
      <div className="section-heading">
        <div><p className="eyebrow">EXPLORE OUR DESTINATIONS</p><h2 id="trips-title">A world of learning<br />outside the classroom.</h2></div>
        <p className="section-intro">Start with a place that sparks questions. Each trip theme is an illustrative starting point for learning through discovery.</p>
      </div>
      <div className="trip-grid">
        {trips.map((trip, index) => <TripCard key={trip.slug} trip={trip} index={index} />)}
      </div>
      <p className="illustrative-note">Trip themes are illustrative. Programme details will be confirmed by MB Learning.</p>
      <a className="section-jump" href="#how-it-works">See how it works</a>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Compass, Lightbulb } from "lucide-react";
import { tripInterestHref } from "@/lib/routes";
import type { Trip } from "@/types/trip";

export function TripDetail({ trip }: { trip: Trip }) {
  return (
    <main className="trip-detail-page" id="main" tabIndex={-1}>
      <div className="trip-detail-wrap">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/#trips"><ArrowLeft size={14} aria-hidden="true" /> All trips</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li aria-current="page">{trip.city}</li>
          </ol>
        </nav>

        <section className="trip-detail-hero" aria-labelledby="trip-title">
          <div className={`trip-detail-photo trip-photo-${trip.slug}`}>
            <Image
              src={trip.image}
              alt={trip.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
              className="trip-detail-image"
            />
            <span className="detail-image-note"><span /> ILLUSTRATIVE DESTINATION IMAGE</span>
          </div>
          <div className="trip-detail-intro">
            <p className="eyebrow">EDUCATIONAL TRIP THEME</p>
            <p className="trip-detail-city">{trip.city}</p>
            <h1 id="trip-title">{trip.theme}</h1>
            <p className="trip-detail-summary">{trip.summary}</p>
            <p className="trip-detail-purpose">{trip.learningPurpose}</p>
            <Link className="button button-primary" href={tripInterestHref(trip.slug)}>
              Register Interest <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="trip-cta-note">Select this trip to carry your destination choice into the interest flow.</p>
          </div>
        </section>

        <section className="trip-overview-section" aria-labelledby="overview-title">
          <div className="trip-section-title">
            <p className="eyebrow">THE LEARNING IDEA</p>
            <h2 id="overview-title">A new way to look<br />at familiar ideas.</h2>
          </div>
          <div className="trip-overview-copy">
            <p>{trip.overview}</p>
            <div className="illustrative-callout">
              <span className="callout-icon"><BookOpenCheck size={19} aria-hidden="true" /></span>
              <p>All programme content on this page is illustrative. Dates, venues, access, schedules and confirmed itineraries have not been provided.</p>
            </div>
          </div>
        </section>

        <section className="learning-objectives" aria-labelledby="objectives-title">
          <div className="objectives-heading">
            <span className="detail-section-icon"><Lightbulb size={21} aria-hidden="true" /></span>
            <div><p className="eyebrow">INTENDED EDUCATIONAL VALUE</p><h2 id="objectives-title">Learning objectives</h2></div>
          </div>
          <ul className="objectives-list">
            {trip.learningObjectives.map((objective) => (
              <li key={objective}><span><Check size={15} aria-hidden="true" /></span>{objective}</li>
            ))}
          </ul>
        </section>

        <section className="activities-section" aria-labelledby="activities-title">
          <div className="activities-heading">
            <div><p className="eyebrow">POSSIBLE ACTIVITY CATEGORIES</p><h2 id="activities-title">Ways to explore</h2></div>
            <Compass size={23} strokeWidth={1.4} aria-hidden="true" />
          </div>
          <div className="activity-grid">
            {trip.activityCategories.map((activity, index) => (
              <article className="activity-card" key={activity}>
                <span>0{index + 1}</span><h3>{activity}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="highlights-section" aria-labelledby="highlights-title">
          <div className="highlights-topline"><p className="eyebrow">ILLUSTRATIVE SAMPLE HIGHLIGHTS</p><span>IDEAS TO SHAPE A PROGRAMME</span></div>
          <h2 id="highlights-title">A few starting points.</h2>
          <ul className="highlight-list">
            {trip.sampleHighlights.map((highlight) => <li key={highlight}><span><Check size={15} aria-hidden="true" /></span>{highlight}</li>)}
          </ul>
          <p className="highlight-disclaimer">These are possible areas of focus, not confirmed inclusions or a scheduled itinerary.</p>
        </section>

        <section className="trip-bottom-cta" aria-labelledby="trip-cta-title">
          <div><p className="eyebrow eyebrow-light">FOR TEACHERS & SCHOOL COORDINATORS</p><h2 id="trip-cta-title">Could this theme fit your school?</h2><p>Continue with this destination selected, or return to compare the other trip themes.</p></div>
          <div className="trip-bottom-actions">
            <Link className="button button-light" href={tripInterestHref(trip.slug)}>Register Interest <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="trip-back-cta" href="/#trips">View all trips</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

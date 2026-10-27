import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, Check, Compass, Lightbulb, MapPin, Sparkles } from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import { tripInterestHref } from "@/lib/routes";
import type { Trip } from "@/types/trip";

export function TripDetail({ trip }: { trip: Trip }) {
  return (
    <main className={`trip-detail-page trip-detail-${trip.slug}`} id="main" tabIndex={-1}>
      <div className="trip-detail-wrap">
        <BackButton fallbackHref="/#trips" label="Back to all trips" />
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/#trips">All trips</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li aria-current="page">{trip.city}</li>
          </ol>
        </nav>

        <section className="trip-detail-hero" aria-labelledby="trip-title">
          <div className={`trip-detail-photo trip-photo-${trip.slug}`}>
            <Image src={trip.image} alt={trip.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 55vw" className="trip-detail-image" />
            <span className="detail-image-note"><span /> ILLUSTRATIVE CITY IMAGE</span>
          </div>
          <div className="trip-detail-intro">
            <p className="eyebrow">CITY LEARNING GUIDE · {trip.theme.toUpperCase()}</p>
            <p className="trip-detail-city">{trip.city}</p>
            <h1 id="trip-title">{trip.headline}</h1>
            <p className="trip-detail-summary">{trip.summary}</p>
            <p className="trip-detail-purpose">{trip.learningPurpose}</p>
            <div className="trip-hero-actions">
              <Link className="button button-primary" href={tripInterestHref(trip.slug)}>Register Interest</Link>
              <a className="trip-text-cta" href="#places">Explore places</a>
            </div>
            <p className="trip-cta-note">Illustrative learning ideas only. No places or activities are confirmed as part of a trip.</p>
          </div>
        </section>

        <section className="trip-story-section" aria-labelledby="story-title">
          <div className="trip-story-heading">
            <span className="detail-section-icon"><BookOpenCheck size={21} aria-hidden="true" /></span>
            <div><p className="eyebrow">A CITY WITH MANY LAYERS</p><h2 id="story-title">The story of {trip.city}</h2></div>
          </div>
          <div className="trip-story-copy">
            <p>{trip.cityStory}</p>
            <p>{trip.overview}</p>
          </div>
        </section>

        <section className="trip-categories-section" aria-labelledby="categories-title">
          <div className="trip-section-title">
            <p className="eyebrow">CHOOSE A LENS</p>
            <h2 id="categories-title">Explore the city<br />through six subjects.</h2>
          </div>
          <nav className="category-jump-nav" aria-label={`${trip.city} learning categories`}>
            {trip.categories.map((category) => <a href={`#${category.id}`} key={category.id}>{category.title}</a>)}
          </nav>
          <div className="category-grid">
            {trip.categories.map((category, index) => (
              <article className={`category-card category-card-${category.emphasis}`} id={category.id} key={category.id}>
                <span className="category-card-number">0{index + 1}</span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="trip-places-section" id="places" aria-labelledby="places-title">
          <div className="trip-places-heading">
            <div><p className="eyebrow">PLACES TO NOTICE</p><h2 id="places-title">A city-sized classroom.</h2></div>
            <p>Possible places to explore, not a confirmed itinerary. Access, permissions and schedules must be checked separately.</p>
          </div>
          <div className="place-grid">
            {trip.places.map((place, index) => (
              <article className="place-card" key={place.name}>
                <div className={`place-image-wrap place-image-${index + 1}`}>
                  <Image
                    src={trip.image}
                    alt={`Illustrative ${trip.city} learning scene; this image may not depict ${place.name}.`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                    className="place-image"
                  />
                  <span className="place-image-label">ILLUSTRATIVE IMAGE</span>
                </div>
                <div className="place-card-content">
                  <div className="place-card-meta"><span><MapPin size={13} aria-hidden="true" />{trip.city}</span><span>{place.category}</span></div>
                  <h3>{place.name}</h3>
                  <p className="place-description">{place.description}</p>
                  <details className="place-learning-detail">
                    <summary>Why students might explore it</summary>
                    <p>{place.learningLink}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="trip-culture-section" aria-labelledby="culture-title">
          <div className="trip-culture-heading">
            <span className="detail-section-icon"><Sparkles size={20} aria-hidden="true" /></span>
            <div><p className="eyebrow">EVERYDAY CULTURE</p><h2 id="culture-title">Food, craft and shared traditions.</h2></div>
          </div>
          <div className="culture-points">
            {trip.cultureAndFood.map((point, index) => <article className="culture-point" key={point}><span>0{index + 1}</span><p>{point}</p></article>)}
          </div>
        </section>

        <section className="trip-modern-section" aria-labelledby="modern-title">
          <div className="trip-modern-title">
            <p className="eyebrow eyebrow-light">THEN, NOW AND NEXT</p>
            <h2 id="modern-title">Systems shape<br />a living city.</h2>
            <p>Use local examples to connect science and social studies with the world students see around them.</p>
          </div>
          <div className="trip-modern-points">
            {trip.modernLearning.map((point, index) => <article key={point}><span>0{index + 1}</span><p>{point}</p></article>)}
          </div>
        </section>

        <section className="trip-learning-section" aria-labelledby="takeaways-title">
          <div className="trip-learning-heading">
            <span className="detail-section-icon"><Lightbulb size={21} aria-hidden="true" /></span>
            <div><p className="eyebrow">TAKE THESE QUESTIONS BACK TO CLASS</p><h2 id="takeaways-title">Learning takeaways</h2></div>
          </div>
          <div className="trip-learning-grid">
            <div>
              <h3>Students can practise</h3>
              <ul className="objectives-list">
                {trip.learningObjectives.map((objective) => <li key={objective}><span><Check size={15} aria-hidden="true" /></span>{objective}</li>)}
              </ul>
            </div>
            <div className="discussion-card">
              <h3>Discussion starters</h3>
              <ol>{trip.discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
              <p>Possible classroom prompts; teachers can adapt them for their students.</p>
            </div>
          </div>
        </section>

        <section className="trip-final-cta" aria-labelledby="trip-cta-title">
          <div><p className="eyebrow eyebrow-light">FOR TEACHERS & SCHOOL COORDINATORS</p><h2 id="trip-cta-title">Could {trip.city} spark a question?</h2><p>Share your school&apos;s interest and keep this destination selected in the enquiry form.</p></div>
          <Link className="button button-light" href={tripInterestHref(trip.slug)}>Register School Interest</Link>
        </section>
        <p className="trip-programme-disclaimer"><Compass size={15} aria-hidden="true" /> All place and activity suggestions are illustrative. Venue access, permissions, dates, schedules and confirmed itineraries have not been provided.</p>
      </div>
    </main>
  );
}

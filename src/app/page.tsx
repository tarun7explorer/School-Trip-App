import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { TripCard } from "@/components/trips/trip-card";
import { trips } from "@/data/trips";

export default function HomePage() {
  return (
    <main id="main">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> SCHOOL TRIP INTEREST PLATFORM</p>
            <h1>Learning lives<br />beyond the <em>classroom.</em></h1>
            <p className="hero-description">Give curiosity a wider world. Explore learning themes that bring science, culture and civic life into focus.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="#trips">Explore trip themes <ArrowRight size={17} aria-hidden="true" /></Link>
              <a className="quiet-link" href="#approach">Our approach <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
            <p className="hero-footnote"><Sparkles size={14} aria-hidden="true" /> Three destinations. Room to discover.</p>
          </div>
          <div className="hero-visual" aria-label="Illustration of a sunlit landscape and an open book">
            <div className="hero-sun" />
            <div className="hero-horizon" />
            <div className="hero-book"><div /><div /></div>
            <span className="visual-note note-top">LOOK CLOSER</span>
            <span className="visual-note note-bottom">THINK FURTHER</span>
            <span className="visual-stamp">MB<br /><b>LEARNING</b></span>
          </div>
        </div>
        <a className="scroll-cue" href="#trips" aria-label="Scroll to explore trip themes"><span /> Scroll to explore</a>
      </section>

      <section className="trips-section section-wrap" id="trips">
        <div className="section-heading">
          <div><p className="eyebrow">THREE WAYS TO DISCOVER</p><h2>Where will curiosity<br />take your class?</h2></div>
          <p className="section-intro">Start with a place and a question. Each destination has an illustrative learning theme to spark ideas for your school.</p>
        </div>
        <div className="trip-grid">{trips.map((trip) => <TripCard key={trip.slug} trip={trip} />)}</div>
        <p className="illustrative-note">Themes shown are illustrative. Programme details will be confirmed by MB Learning.</p>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-inner">
          <p className="eyebrow">OUR APPROACH</p>
          <h2>Learning that starts<br />with a <em>question.</em></h2>
          <div className="approach-bottom"><p>Educational travel can turn ideas from a lesson into things students can observe, discuss and explore together.</p><span className="approach-mark" aria-hidden="true">M<span>.</span></span></div>
        </div>
      </section>
    </main>
  );
}

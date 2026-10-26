import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Compass } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-marker" /> SCHOOL TRIP INTEREST PLATFORM</p>
          <h1 id="hero-title">Learning Beyond<br />the <em>Classroom</em></h1>
          <p className="hero-description">Bring classroom ideas into the world. Explore learning themes in Hyderabad, Jaipur and Delhi, and find a starting point for your school's next experience.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#trips">Explore Trips <ArrowRight size={17} aria-hidden="true" /></Link>
            <a className="quiet-link" href="#how-it-works">How it works <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <div className="hero-note"><Compass size={16} aria-hidden="true" /><span>Three destinations, three ways to discover.</span></div>
        </div>
        <div className="hero-photo-wrap">
          <Image
            className="hero-photo"
            src="/images/hero-education.png"
            alt="School students walking together through a leafy garden on an educational outing."
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <div className="hero-photo-caption"><span className="caption-dot" /> CURIOSITY TAKES YOU PLACES</div>
          <span className="hero-photo-index" aria-hidden="true">MBL <span>·</span> 01</span>
        </div>
      </div>
      <a className="scroll-cue" href="#trips"><span /> DISCOVER THE TRIPS</a>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

export function InterestCta() {
  return (
    <section className="cta-section" id="register-interest" aria-labelledby="cta-title">
      <div className="cta-inner">
        <span className="cta-icon"><BookOpenCheck size={25} strokeWidth={1.5} aria-hidden="true" /></span>
        <p className="eyebrow">FOR TEACHERS & SCHOOL COORDINATORS</p>
        <h2 id="cta-title">Where could learning<br />take your students?</h2>
        <p className="cta-copy">Explore the destinations and find a learning theme that feels right for your school. Interest registration will be added in a later phase.</p>
        <Link className="button button-light" href="#trips">Explore trip themes <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="cta-decoration cta-decoration-one" aria-hidden="true" />
      <div className="cta-decoration cta-decoration-two" aria-hidden="true" />
    </section>
  );
}

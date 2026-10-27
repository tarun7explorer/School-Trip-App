import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

export function InterestCta() {
  return (
    <section className="cta-section" id="register-interest" aria-labelledby="cta-title">
      <div className="cta-inner">
        <span className="cta-icon"><BookOpenCheck size={25} strokeWidth={1.5} aria-hidden="true" /></span>
        <p className="eyebrow">FOR TEACHERS & SCHOOL COORDINATORS</p>
        <h2 id="cta-title">Where could learning<br />take your students?</h2>
        <p className="cta-copy">Share which destination interests your school and an approximate number of students. MB Learning will review the enquiry and follow up with confirmed programme details.</p>
        <Link className="button button-light" href="/interest">Register school interest</Link>
      </div>
      <div className="cta-decoration cta-decoration-one" aria-hidden="true" />
      <div className="cta-decoration cta-decoration-two" aria-hidden="true" />
    </section>
  );
}

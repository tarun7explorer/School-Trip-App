import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";

export const metadata: Metadata = {
  title: "Teacher Access",
  description: "Explore MB Learning city themes and register your school's interest in an educational trip.",
  robots: { index: false, follow: false },
};

export default function TeacherAccessPage() {
  return (
    <main id="main" className="teacher-access-page" tabIndex={-1}>
      <section className="teacher-access-card" aria-labelledby="teacher-access-title">
        <BackButton fallbackHref="/" label="Back to MB Learning" />
        <p className="eyebrow">TEACHER ACCESS</p>
        <h1 id="teacher-access-title">A place to start planning.</h1>
        <p className="teacher-access-copy">Teacher accounts and a private teacher dashboard are not enabled on this platform. You can explore the city learning themes publicly and register your school&apos;s interest without creating an account.</p>
        <div className="teacher-access-actions">
          <Link className="button button-primary" href="/#trips">Explore city themes</Link>
          <Link className="button button-light" href="/interest">Register school interest</Link>
        </div>
        <p className="teacher-access-note">An interest enquiry is not a confirmed booking or itinerary.</p>
      </section>
    </main>
  );
}

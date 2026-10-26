import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { InterestCta } from "@/components/home/interest-cta";
import { TripSection } from "@/components/home/trip-section";
import { WhyEducationalTravel } from "@/components/home/why-educational-travel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educational School Trips in India",
  description: "Explore illustrative school trip themes in Hyderabad, Jaipur and Delhi, with learning ideas for STEM, heritage and civic history.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Learning Beyond the Classroom | MB Learning",
    description: "Explore illustrative school trip themes in Hyderabad, Jaipur and Delhi.",
    url: "/",
    type: "website",
    siteName: "MB Learning",
    locale: "en_IN",
    images: [{ url: "/images/hero-education.png", width: 1536, height: 1024, alt: "Illustrative image of students on an educational outing" }],
  },
};

export default function HomePage() {
  return (
    <main id="main" className="page-shell" tabIndex={-1}>
      <HeroSection />
      <TripSection />
      <HowItWorks />
      <WhyEducationalTravel />
      <InterestCta />
    </main>
  );
}

import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { InterestCta } from "@/components/home/interest-cta";
import { TripSection } from "@/components/home/trip-section";
import { WhyEducationalTravel } from "@/components/home/why-educational-travel";

export default function HomePage() {
  return (
    <main id="main" className="page-shell">
      <HeroSection />
      <TripSection />
      <HowItWorks />
      <WhyEducationalTravel />
      <InterestCta />
    </main>
  );
}

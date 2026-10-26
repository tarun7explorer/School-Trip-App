import type { Trip } from "@/types/trip";

export const trips = [
  {
    slug: "hyderabad-stem",
    city: "Hyderabad",
    theme: "STEM & Innovation",
    summary: "An illustrative learning theme centered on curiosity, problem-solving and technology.",
    learningPurpose: "Encourage curiosity, problem-solving and practical understanding of technology.",
    image: "/images/hyderabad-stem.png",
    imageAlt: "Students collaborating around a robotics exhibit at a science and technology display.",
    sampleHighlights: [
      "Science and innovation experiences",
      "Technology demonstrations",
      "Hands-on learning activities and collaborative challenges",
    ],
  },
  {
    slug: "jaipur-heritage",
    city: "Jaipur",
    theme: "Heritage & Culture",
    summary: "An illustrative learning theme connecting history, architecture and cultural heritage.",
    learningPurpose: "Help students connect classroom learning with historic places, design, craftsmanship and local culture.",
    image: "/images/jaipur-heritage.png",
    imageAlt: "Students looking toward Jaipur's ornate pink sandstone Hawa Mahal in warm morning light.",
    sampleHighlights: [
      "Heritage architecture",
      "Historical storytelling",
      "Traditional crafts and guided cultural exploration",
    ],
  },
  {
    slug: "delhi-discovery",
    city: "Delhi",
    theme: "History, Leadership & Institutions",
    summary: "An illustrative learning theme exploring national history, civic learning and institutions.",
    learningPurpose: "Introduce students to India's historical narrative, public institutions and civic life.",
    image: "/images/delhi-discovery.png",
    imageAlt: "Students walking along a tree-lined New Delhi avenue toward a distant civic landmark.",
    sampleHighlights: [
      "Heritage landmarks and museums",
      "Educational institutions",
      "Age-appropriate civic-learning activities",
    ],
  },
] satisfies Trip[];

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((trip) => trip.slug === slug);
}

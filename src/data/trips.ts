import type { Trip } from "@/types/trip";

export const trips = [
  {
    slug: "hyderabad-stem",
    city: "Hyderabad",
    theme: "STEM & Innovation",
    summary: "An illustrative learning theme centered on curiosity, problem-solving and technology.",
    learningPurpose: "Encourage curiosity, problem-solving and practical understanding of technology.",
    overview: "A possible STEM learning experience can invite students to look closely at how ideas become tools, systems and solutions. This theme is designed to encourage questions, experimentation and collaboration.",
    image: "/images/hyderabad-stem.png",
    imageAlt: "Illustrative scene of students collaborating around a robotics exhibit during a science and technology outing.",
    learningObjectives: [
      "Ask questions about how science and technology shape everyday life.",
      "Observe how design and engineering can respond to practical problems.",
      "Practice explaining ideas and working collaboratively on a challenge.",
    ],
    activityCategories: ["Science and technology exploration", "Demonstration and observation", "Collaborative design challenges"],
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
    overview: "A heritage and culture theme can help students notice how architecture, craft and stories reflect the places people build and the traditions they carry. It offers a starting point for connecting historical study with design and cultural expression.",
    image: "/images/jaipur-heritage.png",
    imageAlt: "Illustrative scene of students looking toward ornate pink sandstone architecture in Jaipur.",
    learningObjectives: [
      "Describe how architectural details can communicate a place's history and use.",
      "Recognize the knowledge and skill involved in traditional crafts and design.",
      "Connect historical stories with the culture and communities of a place.",
    ],
    activityCategories: ["Architecture observation", "Historical storytelling", "Craft and design exploration"],
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
    overview: "A history and civic learning theme can introduce students to the stories, institutions and public life that shape a nation. Students can consider how historical events are remembered and how institutions relate to civic life.",
    image: "/images/delhi-discovery.png",
    imageAlt: "Illustrative scene of students walking along a tree-lined New Delhi avenue toward a civic landmark.",
    learningObjectives: [
      "Explore how historical accounts help explain India's past and present.",
      "Discuss the role public institutions play in civic life.",
      "Consider how leadership, shared responsibility and participation relate to communities.",
    ],
    activityCategories: ["Historical interpretation", "Civic learning and discussion", "Institution and landmark observation"],
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

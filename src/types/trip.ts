export const tripSlugs = [
  "hyderabad-stem",
  "jaipur-heritage",
  "delhi-discovery",
] as const;

export type TripSlug = (typeof tripSlugs)[number];

export function isTripSlug(value: unknown): value is TripSlug {
  return typeof value === "string" && tripSlugs.some((slug) => slug === value);
}

export type Trip = {
  slug: TripSlug;
  city: string;
  theme: string;
  headline: string;
  summary: string;
  learningPurpose: string;
  overview: string;
  cityStory: string;
  image: string;
  imageAlt: string;
  seoDescription: string;
  learningObjectives: string[];
  activityCategories: string[];
  sampleHighlights: string[];
  categories: TripCategory[];
  places: TripPlace[];
  cultureAndFood: string[];
  modernLearning: string[];
  discussionQuestions: string[];
};

export type TripCategory = {
  id: string;
  title: string;
  description: string;
  emphasis: "primary" | "supporting";
};

export type TripPlace = {
  name: string;
  category: string;
  description: string;
  learningLink: string;
  image: string;
  imageAlt: string;
};

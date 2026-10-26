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
  summary: string;
  learningPurpose: string;
  overview: string;
  image: string;
  imageAlt: string;
  learningObjectives: string[];
  activityCategories: string[];
  sampleHighlights: string[];
};

export const tripSlugs = [
  "hyderabad-stem",
  "jaipur-heritage",
  "delhi-discovery",
] as const;

export type TripSlug = (typeof tripSlugs)[number];

export type Trip = {
  slug: TripSlug;
  city: string;
  theme: string;
  summary: string;
  learningPurpose: string;
  sampleHighlights: string[];
};

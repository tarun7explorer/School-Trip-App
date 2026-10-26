import type { TripSlug } from "@/types/trip";

export function tripInterestHref(slug: TripSlug): string {
  return `/interest?trip=${encodeURIComponent(slug)}`;
}

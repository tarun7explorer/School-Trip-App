import type { MetadataRoute } from "next";
import { trips } from "@/data/trips";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicSiteUrl();
  return [
    { url: new URL("/", baseUrl).toString(), changeFrequency: "monthly", priority: 1 },
    ...trips.map(({ slug }) => ({ url: new URL(`/trips/${slug}`, baseUrl).toString(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

import type { MetadataRoute } from "next";
import { trips } from "@/data/trips";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: new URL("/", baseUrl).toString(), changeFrequency: "monthly", priority: 1 },
    ...trips.map(({ slug }) => ({ url: new URL(`/trips/${slug}`, baseUrl).toString(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

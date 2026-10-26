import type { MetadataRoute } from "next";
import { getPublicSiteUrl, isVercelPreview } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicSiteUrl();
  if (isVercelPreview()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin", "/auth/"] },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
  };
}

export function isVercelPreview(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

export function getPublicSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelPreviewUrl = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL?.trim() : undefined;

  let siteUrl: URL;
  if (configuredUrl) {
    try {
      siteUrl = new URL(configuredUrl);
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
    }
  } else if (vercelPreviewUrl) {
    siteUrl = new URL(`https://${vercelPreviewUrl}`);
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds.");
  } else {
    siteUrl = new URL("http://localhost:3000");
  }

  const isLocalDevelopment = ["localhost", "127.0.0.1", "[::1]"].includes(siteUrl.hostname);
  if (siteUrl.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && isLocalDevelopment)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.");
  }
  if (siteUrl.username || siteUrl.password || siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without credentials, path, query or fragment.");
  }

  return siteUrl.origin;
}

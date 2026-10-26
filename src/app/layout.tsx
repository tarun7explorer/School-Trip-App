import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "School Trips for Curious Classrooms | MB Learning",
    template: "%s | MB Learning",
  },
  description: "Explore educational trip themes for schools in Hyderabad, Jaipur and Delhi. Find a starting point for learning beyond the classroom with MB Learning.",
  openGraph: {
    title: "School Trips for Curious Classrooms | MB Learning",
    description: "Explore educational trip themes for schools in Hyderabad, Jaipur and Delhi.",
    type: "website",
    siteName: "MB Learning",
    locale: "en_IN",
    images: [{ url: "/images/hero-education.png", width: 1536, height: 1024, alt: "Illustrative image of students exploring together" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Trips for Curious Classrooms | MB Learning",
    description: "Explore educational trip themes for schools in Hyderabad, Jaipur and Delhi.",
    images: ["/images/hero-education.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}

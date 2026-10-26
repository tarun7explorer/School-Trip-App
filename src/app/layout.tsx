import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
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
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

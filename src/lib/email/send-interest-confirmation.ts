import "server-only";

import type { InterestFormValues } from "@/lib/validations/interest-schema";
import { getTripBySlug } from "@/data/trips";

type ContactDetails = Omit<InterestFormValues, "website">;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export async function sendInterestConfirmation(details: ContactDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const trip = getTripBySlug(details.tripSlug);
  if (!trip) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [details.email],
      subject: `We received your ${trip.city} school trip enquiry`,
      html: `<p>Hello ${escapeHtml(details.teacherName)},</p><p>We have received your school's expression of interest for <strong>${escapeHtml(trip.city)} — ${escapeHtml(trip.theme)}</strong>.</p><p>MB Learning will review the enquiry. Programme details will be shared after they are confirmed.</p>`,
      text: `Hello ${details.teacherName},\n\nWe have received your school's expression of interest for ${trip.city} — ${trip.theme}.\n\nMB Learning will review the enquiry. Programme details will be shared after they are confirmed.`,
    }),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Confirmation email could not be sent.");
}

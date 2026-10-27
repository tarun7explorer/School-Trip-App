"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitTripInterest } from "@/lib/actions/interest-actions";
import { interestSchema, MAX_STUDENT_COUNT, type InterestFormInput, type InterestFormValues } from "@/lib/validations/interest-schema";
import { trips } from "@/data/trips";
import type { TripSlug } from "@/types/trip";

type InterestFormProps = { initialTripSlug?: TripSlug };

export function InterestForm({ initialTripSlug }: InterestFormProps) {
  const [formError, setFormError] = useState("");
  const [savedTrip, setSavedTrip] = useState<TripSlug | null>(null);
  const inFlight = useRef(false);
  const form = useForm<InterestFormInput, undefined, InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      teacherName: "",
      schoolName: "",
      email: "",
      phone: "",
      tripSlug: initialTripSlug ?? "",
      website: "",
    },
  });
  const { errors } = form.formState;

  async function onSubmit(values: InterestFormValues) {
    if (inFlight.current) return;
    inFlight.current = true;
    setFormError("");
    try {
      const result = await submitTripInterest(values);
      if (result.success) {
        setSavedTrip(values.tripSlug);
        return;
      }

      setFormError(result.message);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) form.setError(field as keyof InterestFormInput, { type: "server", message });
      }
    } catch {
      setFormError("We couldn't submit your enquiry just now. Your details are still here; please try again.");
    } finally {
      inFlight.current = false;
    }
  }

  if (savedTrip) {
    const selectedTrip = trips.find((trip) => trip.slug === savedTrip);
    return (
      <section className="interest-success" aria-labelledby="interest-success-title" role="status" aria-live="polite">
        <span className="success-icon"><CheckCircle2 size={27} aria-hidden="true" /></span>
        <p className="eyebrow">ENQUIRY RECEIVED</p>
        <h1 id="interest-success-title">Thank you for sharing your interest.</h1>
        <p>Your school&apos;s interest in {selectedTrip?.city} — {selectedTrip?.theme} has been recorded. If email confirmation is configured, an acknowledgement will be sent to the email address provided.</p>
        <Link className="button button-primary" href="/#trips">Explore other trips</Link>
      </section>
    );
  }

  return (
    <form className="interest-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="form-fields-grid">
        <div className="form-field">
          <label htmlFor="teacherName">Teacher full name <span aria-hidden="true">*</span></label>
          <input id="teacherName" autoComplete="name" placeholder="e.g. Asha Rao" aria-invalid={Boolean(errors.teacherName)} aria-describedby={errors.teacherName ? "teacherName-error" : undefined} {...form.register("teacherName")} />
          {errors.teacherName && <p className="field-error" id="teacherName-error">{errors.teacherName.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="schoolName">School or institution <span aria-hidden="true">*</span></label>
          <input id="schoolName" autoComplete="organization" placeholder="e.g. Greenfield School" aria-invalid={Boolean(errors.schoolName)} aria-describedby={errors.schoolName ? "schoolName-error" : undefined} {...form.register("schoolName")} />
          {errors.schoolName && <p className="field-error" id="schoolName-error">{errors.schoolName.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
          <input id="email" type="email" autoComplete="email" inputMode="email" placeholder="you@school.edu" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...form.register("email")} />
          {errors.email && <p className="field-error" id="email-error">{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone number <span aria-hidden="true">*</span></label>
          <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-help phone-error" : "phone-help"} {...form.register("phone")} />
          <p className="field-hint" id="phone-help">Include your country code if you are outside India.</p>
          {errors.phone && <p className="field-error" id="phone-error">{errors.phone.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="tripSlug">Selected destination <span aria-hidden="true">*</span></label>
          <select id="tripSlug" aria-invalid={Boolean(errors.tripSlug)} aria-describedby={errors.tripSlug ? "tripSlug-error" : undefined} {...form.register("tripSlug")}>
            <option value="">Choose a trip theme</option>
            {trips.map((trip) => <option key={trip.slug} value={trip.slug}>{trip.city} — {trip.theme}</option>)}
          </select>
          {errors.tripSlug && <p className="field-error" id="tripSlug-error">{errors.tripSlug.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="studentCount">Interested students <span aria-hidden="true">*</span></label>
          <input id="studentCount" type="number" min={1} max={MAX_STUDENT_COUNT} step={1} inputMode="numeric" placeholder="e.g. 30" aria-invalid={Boolean(errors.studentCount)} aria-describedby={errors.studentCount ? "studentCount-help studentCount-error" : "studentCount-help"} {...form.register("studentCount", { valueAsNumber: true })} />
          <p className="field-hint" id="studentCount-help">Enter a whole number from 1 to {MAX_STUDENT_COUNT}.</p>
          {errors.studentCount && <p className="field-error" id="studentCount-error">{errors.studentCount.message}</p>}
        </div>
      </div>

      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...form.register("website")} />
      </div>

      <div className="privacy-notice" id="privacy-notice">
        <span className="privacy-lock" aria-hidden="true">i</span>
        <p><strong>How we use your information.</strong> MB Learning will use these details to review and respond to your school&apos;s enquiry. Contact information is not shown publicly and is accessible only to authorized administrators. If email confirmation is enabled, your email address will also be used to send an acknowledgement.</p>
      </div>

      {formError && <p className="form-error-summary" role="alert">{formError}</p>}
      {form.formState.isSubmitting && <p className="form-pending" role="status" aria-live="polite"><LoaderCircle size={16} className="pending-spinner" aria-hidden="true" /> Saving your school&apos;s interest…</p>}

      <div className="form-submit-row">
        <Link className="form-back-link" href="/#trips">Explore trip themes</Link>
        <button className="button button-primary form-submit" type="submit" disabled={form.formState.isSubmitting} aria-disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Submit interest"}
        </button>
      </div>
    </form>
  );
}

"use server";

import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createInterestSubmissionService } from "@/lib/interest/submission-service";
import { checkInterestRateLimit } from "@/lib/security/rate-limit";
import { sendInterestConfirmation } from "@/lib/email/send-interest-confirmation";
import { getClientAddress } from "@/lib/security/client-address";

function logInterestPersistenceFailure(error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  const details: { code?: string; reason: string } = { reason: "database_error" };
  if (error && typeof error === "object") {
    const candidate = error as { code?: unknown };
    if (typeof candidate.code === "string" && /^\d{5}$/.test(candidate.code)) {
      details.code = candidate.code;
      if (candidate.code === "23503") details.reason = "foreign_key_violation";
    }
  }

  // SQLSTATE and a fixed category are useful locally and cannot contain form
  // values, provider credentials, or raw database error details.
  console.error("[interest] Persistence failed", details);
}

export async function submitTripInterest(input: unknown) {
  const requestHeaders = await headers();
  const clientAddress = getClientAddress(requestHeaders);

  const submit = createInterestSubmissionService({
    rateLimit: () => checkInterestRateLimit(clientAddress),
    persist: async (values) => {
      try {
        const supabase = createSupabaseAdminClient();
        const { error } = await supabase.from("trip_interests").insert({
          teacher_name: values.teacherName,
          school_name: values.schoolName,
          email: values.email,
          phone: values.phone,
          trip_slug: values.tripSlug,
          student_count: values.studentCount,
        });
        if (error) logInterestPersistenceFailure(error);
        return error === null;
      } catch (error) {
        logInterestPersistenceFailure(error);
        throw error;
      }
    },
    sendConfirmation: sendInterestConfirmation,
  });

  return submit(input);
}

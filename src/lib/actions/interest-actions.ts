"use server";

import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createInterestSubmissionService } from "@/lib/interest/submission-service";
import { checkInterestRateLimit } from "@/lib/security/rate-limit";
import { sendInterestConfirmation } from "@/lib/email/send-interest-confirmation";

export async function submitTripInterest(input: unknown) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = requestHeaders.get("x-real-ip")?.trim() || forwardedFor || "unknown";

  const submit = createInterestSubmissionService({
    rateLimit: () => checkInterestRateLimit(clientAddress),
    persist: async (values) => {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("trip_interests").insert({
        teacher_name: values.teacherName,
        school_name: values.schoolName,
        email: values.email,
        phone: values.phone,
        trip_slug: values.tripSlug,
        student_count: values.studentCount,
      });
      return error === null;
    },
    sendConfirmation: sendInterestConfirmation,
  });

  return submit(input);
}

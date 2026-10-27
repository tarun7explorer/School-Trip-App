import { interestSchema, type InterestFormValues, type InterestField } from "@/lib/validations/interest-schema";

export type InterestRateLimit = {
  allowed: boolean;
  configured: boolean;
  retryAfterSeconds?: number;
};

export type InterestActionResult =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Partial<Record<InterestField, string>> };

export type InterestSubmissionDependencies = {
  rateLimit: () => Promise<InterestRateLimit>;
  persist: (values: Omit<InterestFormValues, "website">) => Promise<boolean>;
  sendConfirmation?: (values: Omit<InterestFormValues, "website">) => Promise<void>;
};

const genericFailure = "We couldn't submit your enquiry just now. Please try again in a moment.";

export function createInterestSubmissionService(dependencies: InterestSubmissionDependencies) {
  return async function submitInterest(input: unknown): Promise<InterestActionResult> {
    if (input && typeof input === "object" && "website" in input && typeof input.website === "string" && input.website.trim()) {
      return { success: false, message: genericFailure };
    }

    const parsed = interestSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<InterestField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in fieldErrors)) {
          fieldErrors[field as InterestField] = issue.message;
        }
      }
      return { success: false, message: "Check the highlighted fields and try again.", fieldErrors };
    }

    const { website, ...values } = parsed.data;
    void website;

    let rateLimit: InterestRateLimit;
    try {
      rateLimit = await dependencies.rateLimit();
    } catch {
      return { success: false, message: genericFailure };
    }

    if (!rateLimit.allowed) {
      return {
        success: false,
        message: rateLimit.configured
          ? `Too many enquiries from this connection. Please try again in ${Math.max(1, Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60))} minute(s).`
          : genericFailure,
      };
    }

    let saved = false;
    try {
      saved = await dependencies.persist(values);
    } catch {
      saved = false;
    }

    if (!saved) return { success: false, message: genericFailure };

    try {
      await dependencies.sendConfirmation?.(values);
    } catch {
      // The database insert has succeeded. Optional email failure cannot undo it.
    }

    return { success: true };
  };
}

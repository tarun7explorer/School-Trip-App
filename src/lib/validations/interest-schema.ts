import { z } from "zod";
import { tripSlugs } from "@/types/trip";

export const interestSchema = z.object({
  teacherName: z.string().trim().min(2).max(120),
  schoolName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(24),
  tripSlug: z.enum(tripSlugs),
  studentCount: z.coerce.number().int().positive().max(100_000),
});

export type InterestFormValues = z.infer<typeof interestSchema>;

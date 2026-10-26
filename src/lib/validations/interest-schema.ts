import { z } from "zod";
import { tripSlugs } from "@/types/trip";

export const MAX_STUDENT_COUNT = 300;

const tripSlugSchema = z
  .union([z.enum(tripSlugs), z.literal("")])
  .pipe(z.enum(tripSlugs, { errorMap: () => ({ message: "Choose a destination." }) }));

export const interestSchema = z.object({
  teacherName: z.string().trim().min(2, "Enter the teacher's full name.").max(120, "Use 120 characters or fewer."),
  schoolName: z.string().trim().min(2, "Enter the school or institution name.").max(160, "Use 160 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Use 254 characters or fewer.").transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s().-]{5,22}[0-9]$/, "Enter a valid phone number, including country code if needed."),
  tripSlug: tripSlugSchema,
  studentCount: z
    .number({ invalid_type_error: "Enter the number of interested students." })
    .int("Enter a whole number of students.")
    .min(1, "At least one student is required.")
    .max(MAX_STUDENT_COUNT, `Enter no more than ${MAX_STUDENT_COUNT} students.`),
  website: z.string().max(160).optional().default(""),
}).strict();

export type InterestFormInput = z.input<typeof interestSchema>;
export type InterestFormValues = z.output<typeof interestSchema>;
export type InterestField = keyof InterestFormValues;

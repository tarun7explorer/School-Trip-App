import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Enter your password.").max(256),
});

export type AdminLoginValues = z.input<typeof adminLoginSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter for better security"),
});

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, "Type at least 2 characters")
    .max(64, "Keep queries under 64 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SearchFormValues = z.infer<typeof searchSchema>;

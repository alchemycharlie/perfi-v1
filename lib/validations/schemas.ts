/**
 * Zod validation schemas for all PerFi entities.
 * Phase 4 Section 7: "Zod schema defines the shape and validation rules"
 *
 * These schemas are used both server-side (Server Actions) and client-side
 * (form validation) to ensure consistent validation.
 *
 * Full schemas will be added as entities are implemented in Phases C-E.
 * This file establishes the pattern and shared types.
 */

import { z } from 'zod';

// ── Shared field schemas ──

export const emailSchema = z.string().email('Please enter a valid email address');

export const currencyAmountSchema = z
  .number()
  .min(0, 'Amount must be positive')
  .max(999_999_999.99, 'Amount is too large')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places');

// ── Auth schemas ──

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ── Contact and waitlist schemas (Phase B) ──

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: emailSchema,
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const waitlistSchema = z.object({
  email: emailSchema,
});

// Type exports for form usage
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;

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

// ── Account schemas ──

export const accountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['current', 'savings', 'credit_card', 'cash', 'investments']),
  balance: z.coerce.number().min(-999_999_999.99).max(999_999_999.99),
});

export type AccountInput = z.infer<typeof accountSchema>;

// ── Transaction schemas ──

export const transactionSchema = z.object({
  account_id: z.string().uuid('Select an account'),
  category_id: z.string().uuid('Select a category').optional().or(z.literal('')),
  type: z.enum(['expense', 'income', 'transfer']),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(999_999_999.99),
  description: z.string().min(1, 'Description is required').max(200),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// ── Income source schemas ──

export const incomeSourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['employment', 'benefit', 'other']),
  benefit_type: z
    .enum([
      'universal_credit',
      'pip',
      'child_benefit',
      'carers_allowance',
      'esa',
      'housing_benefit',
      'council_tax_reduction',
      'other',
    ])
    .optional()
    .or(z.literal('')),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(999_999_999.99),
  frequency: z.enum(['weekly', 'fortnightly', 'four_weekly', 'monthly']),
  next_pay_date: z.string().min(1, 'Next pay date is required'),
  account_id: z.string().uuid().optional().or(z.literal('')),
});

export type IncomeSourceInput = z.infer<typeof incomeSourceSchema>;

// ── Bill schemas ──

export const billSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(999_999_999.99),
  frequency: z.enum(['weekly', 'fortnightly', 'four_weekly', 'monthly', 'annually']),
  next_due_date: z.string().min(1, 'Next due date is required'),
  payment_method: z.enum(['direct_debit', 'standing_order', 'card', 'manual']),
  account_id: z.string().uuid().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  is_subscription: z.coerce.boolean().default(false),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type BillInput = z.infer<typeof billSchema>;

// ── Budget schemas ──

export const budgetSchema = z.object({
  category_id: z.string().uuid('Select a category'),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(999_999_999.99),
  period: z.literal('monthly').default('monthly'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// ── Goal schemas ──

export const goalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['savings', 'financial']),
  target_amount: z.coerce.number().positive('Target must be greater than zero').max(999_999_999.99),
  target_date: z.string().optional().or(z.literal('')),
  debt_id: z.string().uuid().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
});

export type GoalInput = z.infer<typeof goalSchema>;

export const goalContributionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero').max(999_999_999.99),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type GoalContributionInput = z.infer<typeof goalContributionSchema>;

// ── Debt schemas ──

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  account_id: z.string().uuid().optional().or(z.literal('')),
  balance: z.coerce.number().min(0).max(999_999_999.99),
  minimum_payment: z.coerce.number().min(0).max(999_999_999.99),
  interest_rate: z.coerce.number().min(0).max(100).optional().or(z.literal(0)),
  next_payment_date: z.string().optional().or(z.literal('')),
});

export type DebtInput = z.infer<typeof debtSchema>;

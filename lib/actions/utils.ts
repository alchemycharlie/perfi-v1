/**
 * Server Action utilities for PerFi.
 *
 * Phase 4 Section 7 — Forms Strategy:
 *   1. Zod schema defines shape and validation rules
 *   2. Server Action validates server-side, writes to database
 *   3. Client-side validation uses the same Zod schema
 *   4. FormField component wraps every input with label + error display
 *
 * Every Server Action returns an ActionResult so the client can show
 * field-level errors or success feedback consistently.
 */

import type { z } from 'zod';

/**
 * Standardised return type for all Server Actions.
 *
 * Usage in components:
 *   const [state, formAction] = useActionState(myAction, initialState);
 *   if (state.errors) → show field errors
 *   if (state.error) → show general error toast
 *   if (state.success) → show success feedback
 */
export type ActionResult = {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  data?: string;
};

/**
 * Initial state for useActionState hooks.
 */
export const initialActionState: ActionResult = {
  success: false,
};

/**
 * Validate form data against a Zod schema and return a typed ActionResult.
 *
 * Usage in Server Actions:
 *   const result = validateFormData(formData, mySchema);
 *   if (!result.success) return result.error;
 *   const data = result.data; // fully typed
 */
export function validateFormData<T extends z.ZodType>(
  formData: FormData,
  schema: T,
): { success: true; data: z.infer<T> } | { success: false; error: ActionResult } {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return {
      success: false,
      error: {
        success: false,
        errors: fieldErrors,
      },
    };
  }

  return { success: true, data: result.data };
}

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client using service_role key.
 * Bypasses RLS — use ONLY in server-side code (Server Actions, API routes).
 * NEVER import this in Client Components or expose the service_role key.
 *
 * Used for:
 * - Admin panel queries (cross-user data access)
 * - Stripe webhook handlers (updating subscriptions)
 * - Waitlist and contact form API routes
 * - Database triggers that need to bypass RLS
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

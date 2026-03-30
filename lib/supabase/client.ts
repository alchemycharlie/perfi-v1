import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client.
 * Used in Client Components for real-time subscriptions and client-side queries.
 * RLS applies automatically based on the user's session cookie.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

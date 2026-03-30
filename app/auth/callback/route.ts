import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for Supabase email verification and magic links.
 * Exchanges the auth code for a session, then redirects.
 *
 * Phase 3 Section 8 — Auth flow:
 * - Email verification → redirect to /app/onboarding (new user)
 * - Magic link → redirect to /app/dashboard (existing user)
 * - Password reset → redirect to /reset-password
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

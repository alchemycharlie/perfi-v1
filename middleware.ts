import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js middleware for auth guards, redirects, and session refresh.
 *
 * Phase 3 Section 9 — Protected Route Model:
 * - /app/*       → require auth, check is_disabled, check onboarding
 * - /admin/*     → require auth + admin role
 * - /login, /signup → redirect to /app/dashboard if already authed
 * - /(marketing) → public, no auth
 *
 * Full guard logic will be implemented in Implementation Phase 2.
 * Currently only refreshes the Supabase session.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

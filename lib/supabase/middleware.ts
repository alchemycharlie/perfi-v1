import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Supabase middleware: session refresh + route protection.
 *
 * Phase 3 Section 9 — Protected Route Model:
 *   /app/*          → require auth, check is_disabled, check onboarding
 *   /admin/*        → require auth + admin role
 *   /login, /signup → redirect to /app/dashboard if already authed
 *   /(marketing)/*  → public, no auth
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session — critical for keeping auth alive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Public routes: no auth required ──
  if (isPublicRoute(pathname)) {
    // If logged in and visiting auth pages, redirect to dashboard
    if (user && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }
    return supabaseResponse;
  }

  // ── Protected routes: require auth ──
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Fetch profile for is_disabled, onboarding, and admin checks ──
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_disabled, onboarding_completed')
    .eq('id', user.id)
    .single();

  // Profile may not exist yet (e.g. trigger hasn't fired). Allow through to avoid loops.
  if (profile) {
    // Check disabled account
    if (profile.is_disabled && pathname !== '/disabled') {
      return NextResponse.redirect(new URL('/disabled', request.url));
    }

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      if (profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
      }
    }

    // Onboarding redirect for app routes (not admin, not onboarding itself)
    if (
      pathname.startsWith('/app') &&
      !pathname.startsWith('/app/onboarding') &&
      !profile.onboarding_completed
    ) {
      return NextResponse.redirect(new URL('/app/onboarding', request.url));
    }
  }

  return supabaseResponse;
}

function isPublicRoute(pathname: string): boolean {
  const publicPrefixes = ['/', '/pricing', '/faq', '/about', '/contact', '/waitlist', '/legal'];
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

  // Exact match for home
  if (pathname === '/') return true;

  // Auth routes are public (but redirect if logged in)
  if (authRoutes.some((route) => pathname.startsWith(route))) return true;

  // Marketing routes
  if (publicPrefixes.some((prefix) => prefix !== '/' && pathname.startsWith(prefix))) return true;

  // API routes for public forms
  if (pathname === '/api/waitlist' || pathname === '/api/contact') return true;

  // Auth callback
  if (pathname.startsWith('/auth/callback')) return true;

  // Disabled page
  if (pathname === '/disabled') return true;

  return false;
}

function isAuthRoute(pathname: string): boolean {
  return ['/login', '/signup', '/forgot-password', '/reset-password'].some((route) =>
    pathname.startsWith(route),
  );
}

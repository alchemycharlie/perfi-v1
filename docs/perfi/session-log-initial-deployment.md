# PerFi — Session Log: Initial Deployment & Configuration

## Date: 2026-03-31

## Summary

First deployment session — took the scaffold codebase from local development to a live Vercel deployment with connected Supabase backend. Resolved multiple build and runtime issues encountered along the way.

---

## Work Completed

### 1. Claude Code Skills Added

Cloned three skills into `.claude/` for development tooling:

| Skill | Source | Purpose |
|-------|--------|---------|
| Security Review | `anthropics/claude-code-security-review` | Slash command for security-focused PR code review |
| Webapp Testing | `anthropics/skills/webapp-testing` | Playwright-based web app testing toolkit |
| Frontend Design | `anthropics/skills/frontend-design` | Guidance for distinctive frontend interfaces |

**Files:** `.claude/commands/security-review.md`, `.claude/skills/webapp-testing/`, `.claude/skills/frontend-design/`

---

### 2. Vercel Build Fix — Stripe Lazy Initialization

**Problem:** Build failed with `Neither apiKey nor config.authenticator provided` because `lib/stripe/config.ts` instantiated the Stripe client at module scope. During `next build`, the env var `STRIPE_SECRET_KEY` is unavailable.

**Fix:** Replaced eager `export const stripe = new Stripe(...)` with a lazy `getStripe()` function that only creates the client on first call at request time.

**Files changed:**
- `lib/stripe/config.ts` — new `getStripe()` function
- `app/api/webhooks/stripe/route.ts` — updated to use `getStripe()`
- `lib/actions/billing.ts` — updated to use `getStripe()`

---

### 3. Vercel Build Fix — Admin Pages Static Generation

**Problem:** After fixing Stripe, the build failed on `/admin/dashboard` with `supabaseUrl is required` — same pattern, env vars unavailable during static page generation.

**Fix:** Added `export const dynamic = 'force-dynamic'` to all 7 admin pages to prevent static generation at build time.

**Files changed:**
- `app/admin/dashboard/page.tsx`
- `app/admin/subscriptions/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/users/[id]/page.tsx`
- `app/admin/waitlist/page.tsx`
- `app/admin/support/page.tsx`
- `app/admin/system/page.tsx`

---

### 4. Middleware Crash Fix

**Problem:** After successful build and deploy, the live site returned `500: INTERNAL_SERVER_ERROR` with code `MIDDLEWARE_INVOCATION_FAILED`. The middleware creates a Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — these weren't yet configured in Vercel.

**Fix:** Added a guard in `lib/supabase/middleware.ts` that checks for the env vars and passes the request through (with a console error) rather than crashing. This is a safety net — the real fix was configuring the env vars in Vercel.

**File changed:** `lib/supabase/middleware.ts`

---

### 5. OTP Verification Flow

**Problem:** Supabase auth was configured for OTP (verification code) but the signup page was built for magic link (confirmation URL). After signing up, users saw "Check your email" with no way to enter the code.

**Fix:**
- Added `verifyOtp` server action in `lib/actions/auth.ts`
- Updated signup page to show a 6-digit code input after registration succeeds
- On successful verification, redirects to `/app/onboarding`

**Files changed:**
- `lib/actions/auth.ts` — added `verifyOtp` action, changed success data to return email
- `app/(auth)/signup/page.tsx` — added OTP input step after signup

---

### 6. Vercel Environment Configuration

Configured environment variables in Vercel dashboard:

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Set |
| `NEXT_PUBLIC_APP_URL` | Set |
| `STRIPE_SECRET_KEY` | Pending |
| `STRIPE_WEBHOOK_SECRET` | Pending |
| `STRIPE_PRO_PRICE_ID` | Pending |

---

### 7. Supabase Database Setup

Migrations 001–006 applied via Supabase SQL Editor:

1. `001_updated_at_trigger.sql` — timestamp auto-update
2. `002_create_tables.sql` — all tables
3. `003_rls_policies.sql` — row-level security
4. `004_indexes.sql` — performance indexes
5. `005_signup_triggers.sql` — auto-create profile + subscription on signup
6. `006_transaction_balance_trigger.sql` — account balance sync

---

### 8. Custom Supabase Email Template

Created a verification code email template for OTP login, configured in Supabase Dashboard > Authentication > Email Templates.

---

## Known Issues Identified

1. **Workspace RLS on onboarding** — Step 2 (workspace type) can fail with `new row violates row-level security policy for table "workspaces"`. Direct SQL insert works. Suspected session cookie timing issue. Workaround: insert workspace + membership via SQL Editor.

2. **Supabase auth rate limits** — Free tier limits to ~3 auth emails/hour per recipient. Can block development/testing. Workaround: manually confirm users in Supabase Dashboard.

---

## Current State

- Site is live and deployed on Vercel
- Auth flow works (signup with OTP, login with password)
- Onboarding completes (with workspace workaround)
- Dashboard renders with demo data
- Admin pages are access-controlled
- Stripe billing is scaffolded but not yet connected

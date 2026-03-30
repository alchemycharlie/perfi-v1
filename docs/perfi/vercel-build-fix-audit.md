# PerFi — Vercel Build Fix Audit Report

## Issue: Production Build Failure on Vercel

## Status: Resolved

## Date: 2026-03-30

---

## Summary

The Vercel production build (`next build`) was failing during the "Collecting page data" phase with the error:

```
Error: Neither apiKey nor config.authenticator provided
```

This prevented deployment of the application. The root cause was environment variables being unavailable at build time, causing module-level initialization to fail.

---

## Root Cause Analysis

### 1. Stripe Client Eager Initialization

**File:** `lib/stripe/config.ts`

The Stripe SDK client was instantiated at **module scope**:

```ts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { ... });
```

During `next build`, Next.js collects page data for all routes. When it processed `/api/webhooks/stripe`, it imported `lib/stripe/config.ts`, which immediately called `new Stripe()` without a valid API key. Stripe's constructor requires either an `apiKey` or `config.authenticator`, and since `STRIPE_SECRET_KEY` is not available in the Vercel build environment (it is a runtime-only secret), the build crashed.

### 2. Admin Pages Attempted Static Generation

**Files:** All `app/admin/**/page.tsx` (6 pages)

Next.js attempted to statically pre-render all admin pages during the build. These pages call `createAdminClient()`, which requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — both unavailable at build time. This produced:

```
Error: supabaseUrl is required.
```

---

## Changes Made

### Fix 1: Lazy-Initialize Stripe Client

**File:** `lib/stripe/config.ts`

Replaced the eager top-level `new Stripe()` with a lazy `getStripe()` function that only instantiates the client on first use (at request time, when env vars are available):

```ts
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}
```

**Files updated to use `getStripe()`:**

| File | Calls Updated |
|------|---------------|
| `app/api/webhooks/stripe/route.ts` | `webhooks.constructEvent()`, `subscriptions.retrieve()` |
| `lib/actions/billing.ts` | `customers.create()`, `checkout.sessions.create()`, `billingPortal.sessions.create()`, `subscriptions.update()` (x2) |

### Fix 2: Force Dynamic Rendering on Admin Pages

Added `export const dynamic = 'force-dynamic'` to all admin pages that use `createAdminClient()`, preventing Next.js from attempting static generation:

| Page | Route |
|------|-------|
| `app/admin/dashboard/page.tsx` | `/admin/dashboard` |
| `app/admin/subscriptions/page.tsx` | `/admin/subscriptions` |
| `app/admin/users/page.tsx` | `/admin/users` |
| `app/admin/users/[id]/page.tsx` | `/admin/users/[id]` |
| `app/admin/waitlist/page.tsx` | `/admin/waitlist` |
| `app/admin/support/page.tsx` | `/admin/support` |
| `app/admin/system/page.tsx` | `/admin/system` |

---

## Additional Changes (Same Branch)

### Claude Code Skills Added

Three skills were cloned into `.claude/` for development tooling:

| Skill | Source | Location |
|-------|--------|----------|
| Security Review | `anthropics/claude-code-security-review` | `.claude/commands/security-review.md` |
| Webapp Testing | `anthropics/skills/webapp-testing` | `.claude/skills/webapp-testing/` |
| Frontend Design | `anthropics/skills/frontend-design` | `.claude/skills/frontend-design/` |

These are development-time tools only and do not affect the production build or runtime.

---

## Verification

After applying both fixes, `npm run build` completes successfully with all routes rendering as expected:

- **Static pages** (marketing, auth, legal): Pre-rendered at build time
- **Dynamic pages** (app/*, admin/*, API routes): Server-rendered on demand
- **No build errors** related to missing environment variables

---

## Impact Assessment

- **Risk:** Low — changes are limited to initialization timing and rendering strategy
- **Breaking changes:** None — `getStripe()` is functionally identical to the previous `stripe` export; admin pages were already server-rendered in practice (they require auth)
- **Performance:** No impact — admin pages were never meaningfully cacheable as static content; Stripe client is still a singleton after first call

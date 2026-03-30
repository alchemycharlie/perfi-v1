# PerFi — Implementation Phase 9 Checkpoint

## Phase: Stripe Billing, Entitlements, and Premium Feature Gating

## Status: Complete

## Date: 2026-03-30

---

## Checklist

### 1. Stripe checkout flow

- [x] `createCheckoutSession` Server Action
- [x] Creates Stripe customer on first upgrade
- [x] Redirects to Stripe Checkout with Pro price
- [x] Success URL returns to billing page

### 2. Billing portal access

- [x] `createPortalSession` Server Action
- [x] Redirects to Stripe Customer Portal for payment management

### 3. Entitlement model

- [x] `PLAN_LIMITS` with all free/pro limits
- [x] `canCreate(plan, resource, count)` for count-based limits
- [x] `canAccessFeature(plan, feature)` for boolean features
- [x] `UPGRADE_MESSAGES` for all gating triggers
- [x] `getUserPlan(supabase, userId)` helper

### 4. Paid plan enforcement

- [x] Accounts: server-side check in `createAccount` (free ≤ 3)
- [x] Budgets: server-side check in `createBudget` (free ≤ 5)
- [x] Goals: server-side check in `createGoal` (free ≤ 2)
- [x] Advanced analytics: `isPro` check in analytics Server Component
- [x] Cashflow forecasting: `isPro` check in cashflow Server Component
- [x] Net worth: `isPro` check in analytics Server Component

### 5. Upgrade prompts

- [x] UpgradeBanner on analytics page (advanced features)
- [x] UpgradeBanner on cashflow page (forecasting)
- [x] Pro badge on Analytics sidebar nav item
- [x] Billing page with "Upgrade to Pro" CTA for free users
- [x] Server Actions return upgrade messages when limits reached

### 6. Subscription state handling

- [x] Webhook handles 5 Stripe events
- [x] Signature verification on all webhooks
- [x] `checkout.session.completed` → pro + active
- [x] `customer.subscription.updated` → status + dates + cancellation
- [x] `customer.subscription.deleted` → free + expired
- [x] `invoice.payment_failed` → past_due
- [x] `invoice.paid` → active (if was past_due)

### 7. Downgrade handling

- [x] Data preserved on downgrade (never deleted)
- [x] Extra resources remain visible, creation blocked beyond limits
- [x] Pro features show UpgradeBanner

### 8. Backend checks

- [x] Server-side entitlement checks in Server Actions (authoritative)
- [x] Client-side UpgradeBanners for UX only
- [x] Webhook uses service_role client (bypasses RLS)

---

## Build Verification

| Check              | Result           |
| ------------------ | ---------------- |
| `npx tsc --noEmit` | Pass (0 errors)  |
| `npx eslint .`     | Pass (0 errors)  |
| `npx next build`   | Pass (38 routes) |

---

## Known Caveats

1. **Requires real Stripe keys**: Checkout, portal, and webhooks need a configured Stripe account with a Pro price product.

2. **Webhook testing requires Stripe CLI**: Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local development.

3. **No workspace limit enforcement**: The workspace creation entitlement check exists in `canCreate` but isn't wired into workspace creation (single workspace for most v1 users).

4. **Stripe API version casting**: The latest Stripe SDK types differ from the webhook event object structure, requiring `as unknown as Record<string, unknown>` casts in the webhook handler.

---

## Ready for Phase 10

Phase 10 should cover:

- Contact and waitlist API route backend wiring
- Admin panel functionality
- CSV export
- Accessibility audit and fixes
- Final polish and launch prep

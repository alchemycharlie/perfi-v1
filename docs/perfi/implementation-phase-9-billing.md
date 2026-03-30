# PerFi — Implementation Phase 9: Stripe Billing, Entitlements, and Premium Feature Gating

## Objective

Implement real subscription handling and premium feature enforcement.

---

## What was built

### 1. Stripe billing Server Actions (`lib/actions/billing.ts`)

| Action                  | Purpose                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `createCheckoutSession` | Creates Stripe Checkout Session for Pro upgrade. Creates Stripe customer if needed. Redirects to Stripe. |
| `createPortalSession`   | Creates Stripe Customer Portal session for managing payment methods.                                     |
| `cancelSubscription`    | Sets `cancel_at_period_end` on Stripe subscription.                                                      |
| `resumeSubscription`    | Resumes subscription by clearing `cancel_at_period_end`.                                                 |

### 2. Stripe webhook handler (`app/api/webhooks/stripe/route.ts`)

Handles 5 events per Phase 3 Section 14:

| Event                           | Action                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `checkout.session.completed`    | Sets plan=pro, status=active. Stores Stripe customer/subscription IDs and period dates. |
| `customer.subscription.updated` | Updates status, period dates, cancellation flag.                                        |
| `customer.subscription.deleted` | Downgrades to free. Clears Stripe subscription ID. Data preserved.                      |
| `invoice.payment_failed`        | Sets status to past_due.                                                                |
| `invoice.paid`                  | Restores active status if was past_due.                                                 |

All webhooks: signature-verified, uses service_role client (bypasses RLS), processes idempotently.

### 3. Server-side entitlement enforcement

Added to `createAccount`, `createBudget`, `createGoal` Server Actions:

- Checks current count against plan limits before allowing creation
- Returns UPGRADE_MESSAGES when limit reached
- This is the authoritative check — cannot be bypassed by client manipulation

| Resource   | Free limit | Pro limit |
| ---------- | ---------- | --------- |
| Accounts   | 3          | Unlimited |
| Budgets    | 5          | Unlimited |
| Goals      | 2          | Unlimited |
| Workspaces | 1          | 5         |

### 4. Enhanced entitlements utility (`lib/utils/entitlements.ts`)

- `canCreate(plan, resource, count)` — count-based limit check
- `canAccessFeature(plan, feature)` — boolean feature check
- `getUserPlan(supabase, userId)` — fetch plan from subscription
- `UPGRADE_MESSAGES` — per-feature upgrade prompt text from Phase 2
- `PLAN_LIMITS` — complete free/pro limit definitions

### 5. Billing page (`app/app/settings/billing/page.tsx`)

4 states per Phase 4 Section 17.5:

| State            | Display                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| Free plan        | Feature list + "Upgrade to Pro — £4.99/month" button → Stripe Checkout         |
| Pro (active)     | Next billing date + "Manage payment method" (→ Portal) + "Cancel subscription" |
| Pro (cancelling) | "Your Pro plan ends on [date]" + "Resume subscription" button                  |
| Pro (past due)   | "Payment failed" + "Update payment method" (→ Portal)                          |

### 6. Client-side gating (existing from Phase 7-8)

- UpgradeBanner on analytics page (advanced features)
- UpgradeBanner on cashflow page (forecasting)
- Pro badge on Analytics sidebar nav item
- `isPro` checks in analytics and cashflow Server Components

---

## Downgrade handling

Per Phase 3 Section 14:

- Data is **never deleted** on downgrade
- Extra accounts/budgets/goals remain visible but user cannot create new ones beyond Free limits
- Pro features (advanced analytics, forecasting, net worth) show UpgradeBanner
- Grace-based approach — no punishment for downgrading

---

## What this phase did NOT do

- No admin billing management (admin views Stripe Dashboard directly)
- No annual billing (monthly only in v1)
- No refund handling (no refunds per terms)
- No workspace limit enforcement (deferred — most users have 1 workspace)

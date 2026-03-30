# PerFi — Implementation Phase 3: Auth, Protected Routing, App Shell, and Admin Shell

## Objective

Implement the authentication foundation, protected route handling, user app shell, and admin shell without building full feature logic.

---

## What was built

### 1. Middleware (route protection)

**File**: `lib/supabase/middleware.ts` + `middleware.ts`

Full route protection per Phase 3 Section 9:

| Route pattern                                              | Behaviour                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/(marketing)/*`                                           | Public, no auth                                                                                                          |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public. Redirects to `/app/dashboard` if already authenticated.                                                          |
| `/app/*`                                                   | Requires auth. If no session → `/login`. If `is_disabled` → `/disabled`. If `!onboarding_completed` → `/app/onboarding`. |
| `/admin/*`                                                 | Requires auth + `profiles.role = 'admin'`. Non-admins redirected to `/app/dashboard`.                                    |
| `/api/waitlist`, `/api/contact`                            | Public (form endpoints)                                                                                                  |
| `/auth/callback`                                           | Public (auth code exchange)                                                                                              |
| `/disabled`                                                | Public (disabled account page)                                                                                           |

### 2. Auth actions (`lib/actions/auth.ts`)

Server Actions for all auth flows per Phase 3 Section 8:

| Action                 | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `signUp`               | Email + password signup. Sends verification email via Supabase.      |
| `signIn`               | Email + password login. Redirects to dashboard (or custom redirect). |
| `signInWithMagicLink`  | Passwordless login via email OTP.                                    |
| `resetPasswordRequest` | Sends password reset email.                                          |
| `updatePassword`       | Sets new password (after reset link click).                          |
| `signOut`              | Signs out and redirects to `/login`.                                 |

### 3. Auth callback route (`app/auth/callback/route.ts`)

Handles email verification and magic link redirects by exchanging the auth code for a session, then redirecting to the appropriate page.

### 4. Auth pages (`app/(auth)/`)

| Page               | Features                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `/login`           | Email + password form, magic link form, forgot password link, signup link. Shows redirect param messages and error states. |
| `/signup`          | Email + password form with validation. Success state shows "check email" message. Terms/privacy links.                     |
| `/forgot-password` | Email form. Success state shows confirmation.                                                                              |
| `/reset-password`  | New password form. Redirects to login on success.                                                                          |

All auth pages use `useActionState` for form handling per the Phase 4 Section 7 forms strategy.

### 5. Auth layout (`app/(auth)/layout.tsx`)

Centred card layout with PerFi logo link. Matches Phase 4 Section 3 route group table.

### 6. App shell (`app/app/layout.tsx`)

| Component  | File                         | Description                                                                                                                                    |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| AppSidebar | `components/app/sidebar.tsx` | Desktop sidebar (hidden on mobile) with all 10 nav items per Phase 2 Section 2, plus Settings. Icons for each item. Active state highlighting. |
| AppTopBar  | `components/app/top-bar.tsx` | Top bar with: mobile hamburger menu, "+ Transaction" quick-add button, user avatar menu (Settings, Billing, Help, Sign out).                   |
| MobileNav  | (within top-bar.tsx)         | Slide-out drawer with full nav for mobile.                                                                                                     |

Sidebar nav items match Phase 2 Section 2 exactly:
Dashboard, Accounts, Transactions, Budgets, Bills & Subscriptions, Cashflow, Goals, Debt, Income, Analytics

### 7. Admin shell (`app/admin/layout.tsx`)

| Component    | File                           | Description                                                                                |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------ |
| AdminSidebar | `components/admin/sidebar.tsx` | Desktop sidebar with all 6 admin nav items per Phase 2 Section 3, plus "Back to app" link. |
| AdminTopBar  | `components/admin/top-bar.tsx` | Minimal top bar with "Admin Panel" label and sign out.                                     |

Admin access is enforced by middleware (profile.role = 'admin' check).

### 8. Dashboard placeholder (`app/app/dashboard/page.tsx`)

Placeholder with 3 stat cards (Total Balance, This Month Spending, Budget Status) and empty transactions section. Structural foundation for Phase C.

### 9. Onboarding shell (`app/app/onboarding/page.tsx`)

5-step progress indicator matching Phase 2 Section 8: Display name, Workspace type, Income, Benefits, Get started. Full flow deferred to Phase C.

### 10. Disabled account page (`app/disabled/page.tsx`)

Static page for disabled accounts. Middleware redirects here when `profiles.is_disabled = true`.

### 11. ActionResult type (`lib/actions/utils.ts`)

Standardised return type for Server Actions: `{ success, error?, errors?, data? }` with `initialActionState` and `validateFormData` helper.

---

## Route protection summary

```
Public:           /  /pricing  /faq  /about  /contact  /waitlist  /legal/*
Public (auth):    /login  /signup  /forgot-password  /reset-password  /auth/callback  /disabled
Protected (user): /app/*  (redirects to /login if no session)
Protected (admin): /admin/*  (redirects to /app/dashboard if not admin role)
```

---

## What this phase did NOT do

- No database schema or migrations (deferred to Phase 4)
- No profile creation trigger (needs database)
- No workspace creation or workspace switcher logic
- No real transaction quick-add (button is placeholder)
- No onboarding form logic
- No Stripe billing
- No admin functionality beyond shell and access guard

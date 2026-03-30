# PerFi — Implementation Phase 1: Project Setup, Repo Hardening, and Delivery Foundation

## Objective

Prepare the repository for serious implementation. No product features — only engineering foundation.

---

## Stack Confirmed

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js App Router | 16.2.1 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Components | Radix UI primitives + Tailwind | Various |
| Database | Supabase (Postgres + Auth + RLS) | ^2.100 |
| Payments | Stripe | ^21 |
| Validation | Zod | ^4 |
| Charts | Recharts | ^3 |
| Formatting | Prettier | ^3 |
| Linting | ESLint (Next.js + TS + Prettier) | ^9 |

---

## Repo Structure

```
perfi-v1/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── layout.tsx        # Marketing header + footer
│   │   └── page.tsx          # Home page placeholder
│   ├── (auth)/               # Login, signup, password reset
│   │   ├── layout.tsx        # Centred card layout
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── app/                  # Authenticated product
│   │   ├── layout.tsx        # App shell: sidebar + top bar
│   │   ├── dashboard/page.tsx
│   │   ├── accounts/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── budgets/page.tsx
│   │   ├── bills/page.tsx
│   │   ├── cashflow/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── debt/page.tsx
│   │   ├── income/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/                # Internal admin area
│   │   ├── layout.tsx        # Admin shell
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── waitlist/page.tsx
│   │   ├── subscriptions/page.tsx
│   │   ├── support/page.tsx
│   │   └── system/page.tsx
│   ├── api/
│   │   ├── webhooks/stripe/route.ts
│   │   ├── waitlist/route.ts
│   │   └── contact/route.ts
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Design tokens + Tailwind
│   ├── not-found.tsx         # 404 page
│   └── error.tsx             # Error boundary
├── components/
│   ├── ui/                   # UI primitives (Button, Input, etc.)
│   ├── marketing/            # Marketing-specific components
│   ├── app/                  # App-specific components
│   ├── admin/                # Admin-specific components
│   └── shared/               # Cross-surface components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server Component client
│   │   ├── middleware.ts      # Middleware client + session refresh
│   │   └── admin.ts          # service_role client
│   ├── stripe/
│   │   └── config.ts         # Stripe server client
│   ├── utils/
│   │   ├── cn.ts             # Class name merge utility
│   │   ├── currency.ts       # GBP formatting
│   │   ├── dates.ts          # Recurring date calculation (placeholder)
│   │   └── entitlements.ts   # Plan limit checks (placeholder)
│   └── validations/
│       └── schemas.ts        # Zod schemas
├── supabase/
│   └── migrations/           # SQL migrations (Phase 2)
├── public/
│   └── images/
├── docs/perfi/               # Planning + implementation docs
├── middleware.ts              # Next.js middleware entry point
├── .env.example              # Environment variable template
├── .editorconfig
├── .prettierrc
├── .prettierignore
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Environment Variables

All required variables documented in `.env.example`:

| Variable | Purpose | Public |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (bypasses RLS) | No |
| `STRIPE_SECRET_KEY` | Stripe server-side API key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification | No |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan | No |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes |

---

## Design Tokens

CSS custom properties defined in `globals.css` per Phase 4 Section 4:

- Background: primary (white), secondary (off-white), tertiary (light grey)
- Text: primary (near-black), secondary (mid grey), muted (light)
- Accent: muted teal-green (#387864)
- Semantic: success (green), warning (amber), danger (muted red)
- Border: subtle grey
- Radii: sm (6px), md (8px), lg (12px)
- Font: Inter (system sans-serif fallback)

---

## npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format all files |
| `npm run format:check` | Prettier check (CI-friendly) |
| `npm run typecheck` | TypeScript type check |
| `npm run check` | Run all checks (typecheck + lint + format) |

---

## Deviations from Planning Docs

| Area | Plan | Actual | Reason |
|------|------|--------|--------|
| Font loading | `next/font/google` for Inter | System sans-serif fallback | Google Fonts blocked in build environment. Self-hosted Inter to be added in Phase B/C when deployment environment is confirmed. |
| Middleware naming | `middleware.ts` | `middleware.ts` (deprecated in Next.js 16, now "proxy") | Next.js 16 renamed middleware to proxy. The file still works under the old name. Will evaluate migration in a future phase. |
| Hosting | Phase 5 recommends Vercel | Not yet deployed | Deployment is part of Build Phase A in the planning docs. Will be addressed in Implementation Phase 2. |

---

## Local Setup

```bash
# Clone and install
git clone <repo-url>
cd perfi-v1
npm install

# Configure environment
cp .env.example .env.local
# Fill in Supabase and Stripe keys

# Development
npm run dev        # http://localhost:3000

# Quality checks
npm run check      # typecheck + lint + format
```

---

## What This Phase Did NOT Do

Per the phase boundary rules:

- No database schema or migrations
- No auth flow implementation
- No middleware guard logic (only session refresh)
- No landing page content
- No onboarding flow
- No dashboard implementation
- No billing/payment flows
- No admin features
- No CI/CD pipeline configuration
- No deployment

These are all scoped to future implementation phases.

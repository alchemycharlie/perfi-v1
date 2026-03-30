# PerFi — Final Master Plan

This document consolidates all approved planning from Phases 1–5 into a single implementation reference. It is a synthesis, not a replacement — for deep detail, refer to the individual phase documents.

---

## Product Summary

**PerFi** is a UK-focused, manual-first personal finance planning SaaS. It provides budgeting, cashflow visibility, savings goals, debt tracking, and benefits-aware income tracking. It is designed with neurodiversity-conscious UX and accessibility as defaults.

It is **not** a banking app, investment platform, Open Banking product, or financial advice service.

**Positioning**: "PerFi is a UK-focused personal finance planner built for clarity, accessibility, and real life — no bank connections required."

**Pricing**: Free tier (generous) + Pro at £4.99/month.

---

## Product Principles

1. **Manual first** — No Open Banking, no bank sync. Users control their own data.
2. **UK first** — GBP only. UK pay structures, benefits, terminology.
3. **Neurodiversity and accessibility focused** — Low cognitive load, predictable navigation, progressive disclosure, WCAG 2.1 AA.
4. **Trust first** — Calm, credible design. No dark patterns. Clear privacy messaging.
5. **Honest scope** — Ship what works. Do not over-promise.

---

## Target Users

| Segment | Key needs |
|---------|-----------|
| UK young professionals | Simple budgeting, savings goals, cashflow |
| UK families/households | Bill tracking, direct debits, pay dates |
| Neurodivergent users | Low cognitive load, predictable UI, calm design |
| Benefits-receiving individuals | Benefits as income, irregular payment tracking |
| Privacy-conscious users | Manual-first, no bank connections |

---

## Three Product Surfaces

### 1. Public Marketing Site
- Landing page, pricing, FAQ, about, contact, waitlist, legal
- SEO-optimised, static rendering
- Tabbed interactive product preview

### 2. Authenticated App
- 15 pages: Dashboard, Accounts, Account detail, Transactions, Budgets, Bills, Cashflow, Goals, Goal detail, Income, Analytics, Debt, Settings, Billing, Onboarding
- Sidebar + top bar navigation
- Mobile: bottom tab bar (Dashboard, Transactions, Budgets, Cashflow, More)

### 3. Internal Admin
- 7 pages: Dashboard, Users, User detail, Waitlist, Subscriptions, Support, System
- service_role access, dense functional UI

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router (TypeScript) |
| Styling | Tailwind CSS + CSS variables for design tokens |
| Components | Radix UI primitives + Tailwind (shadcn/ui patterns) |
| Database | Supabase Postgres with Row Level Security |
| Auth | Supabase Auth (email+password, magic link) |
| Payments | Stripe (Checkout, webhooks, Customer Portal) |
| Hosting | Vercel (changed from Cloudflare in Phase 5 — less friction for Next.js App Router) |
| DNS | Cloudflare |
| Transactional email | Resend |
| Marketing email | Buttondown |
| Error tracking | Sentry |
| Charts | Recharts |
| Validation | Zod |
| Typeface | Inter |

---

## Database Schema (17 tables)

### Global (not workspace-scoped)
- `profiles` — display name, role, onboarding status, preferences (incl. `has_seen_tour`), `is_disabled`
- `subscriptions` — Stripe mirror: customer ID, subscription ID, plan, status, billing dates
- `waitlist_entries` — email, interests, status
- `contact_submissions` — name, email, message, status
- `admin_notes` — user-linked notes from admins
- `feature_flags` — key-value toggles

### Workspace infrastructure
- `workspaces` — name, type (personal/personal_household), owner, is_demo flag
- `workspace_members` — user-workspace join with role (owner in v1)

### Workspace-scoped (all have workspace_id + RLS)
- `accounts` — name, type, balance, sort order
- `categories` — name, type (expense/income/transfer), icon, colour, is_default
- `transactions` — amount, description, date, type, account, category, bill link
- `income_sources` — name, type (employment/benefit/other), benefit_type, amount, frequency, next_pay_date
- `bills` — name, amount, frequency, next_due_date, payment_method, is_subscription
- `budgets` — category, amount, period (monthly)
- `goals` — name, type (savings/financial), target, current, linked debt/category
- `goal_contributions` — amount, date, linked goal
- `debts` — name, balance, minimum payment, interest rate, next payment date

### Key schema decisions
- UUIDs everywhere
- Hard deletes (no soft delete)
- Timestamps (created_at, updated_at) on every table
- workspace_id denormalised on transactions and goal_contributions for RLS performance
- Benefits in same table as employment income (nullable benefit_type)
- Budget spent calculated at query time (no stored value)
- Signup triggers: auto-create profile + subscription on new auth.users row
- Account balance updated via Postgres trigger on transaction changes

---

## Auth and Security

- Supabase Auth: email+password, magic link, email verification required
- Sessions: httpOnly cookies via `@supabase/ssr`, JWT + refresh token rotation
- Signup triggers: auto-create profile (role=user) + subscription (plan=free)
- Middleware: `/app/*` requires auth, `/admin/*` requires admin role, onboarding redirect
- RLS on every table: workspace-scoped tables check membership, admin-only tables have no policies (service_role only)
- Input validation: Zod schemas on all Server Actions
- Stripe webhook signature verification on every event

---

## Pricing and Entitlements

| | Free | Pro (£4.99/month) |
|---|---|---|
| Accounts | ≤ 3 | Unlimited |
| Budgets | ≤ 5 | Unlimited |
| Goals | ≤ 2 | Unlimited |
| Workspaces | 1 | ≤ 5 |
| Analytics | Basic | Advanced + trends + net worth |
| Cashflow forecasting | — | Yes |
| CSV import | — | Yes |
| CSV export | Transactions only | All data |
| All other features | Yes | Yes |

Enforcement: server-side (authoritative) + client-side (UX). Soft gates with inline UpgradeBanner, not blocking modals.

---

## Stripe Integration

- Free users: no Stripe interaction
- Upgrade: Server Action creates Stripe Checkout Session → user completes on Stripe → webhook updates subscription
- Cancel: Server Action sets `cancel_at_period_end` → webhook confirms
- Webhook handler: `/api/webhooks/stripe` handles 5 events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.paid`
- Downgrade: data preserved, Pro features become inaccessible

---

## Onboarding

5 steps, progressive, skippable:

1. Display name
2. Workspace type (Personal / Personal + Household)
3. Income (amount, frequency, next pay date)
4. Benefits (named UK types: UC, PIP, Child Benefit, Carer's Allowance, ESA, Housing Benefit, Council Tax Reduction, Other)
5. Start mode (Demo data / Blank workspace)

Demo data: 3 accounts, 2 income sources, ~30 transactions, 5 bills, 4 budgets, 1 debt, 2 goals.
Guided tour: 4-step tooltip walkthrough on first demo load.
Demo banner: persistent until user clears demo data.

---

## Key UX Decisions

- **One primary action per page** (Dashboard → +Transaction, Budgets → Set budget, etc.)
- **Quick-add transaction**: slide-out panel from top bar, optimised for under 5 seconds
- **Progressive disclosure**: transaction rows expand on click to show details
- **Empty states on every page**: title, description, and primary action
- **Undo**: toast-based for single-item deletions (5-second window)
- **No aggressive red/green**: muted colours with text labels for financial status
- **Muted teal-green accent**: organic, calm, not standard fintech blue
- **Inter typeface**: tabular numbers for financial data
- **Accessibility**: WCAG 2.1 AA, keyboard nav, screen readers, skip links, reduced motion, axe-core in CI
- **Mobile**: bottom tab bar, responsive sidebar

---

## Architecture Decisions

- **Server Components for reads**: data fetched server-side, streamed to client
- **Server Actions for mutations**: no API route layer for CRUD
- **API routes only for**: Stripe webhooks, waitlist form, contact form
- **No global state library**: Server Components + React context
- **Workspace context**: React context + localStorage, sent with every Server Action
- **Recharts**: code-split via dynamic import (not loaded on marketing pages)
- **CSS variables**: design tokens ready for future dark mode

---

## Build Order

| Phase | What | Duration |
|-------|------|----------|
| A | Foundation: project setup, database, auth, deploy | 1–2 weeks |
| B | Marketing site + waitlist (can overlap with C) | 1–2 weeks |
| C | Core app: accounts, transactions, categories, dashboard | 2–3 weeks |
| D | Full features: budgets, bills, income, goals, debt, cashflow | 2–3 weeks |
| E | Payments + entitlements + admin panel | 1–2 weeks |
| F | Polish, accessibility, legal, launch | 1–2 weeks |

**Total: 10–14 weeks** (solo founder, full-time). Realistically 16–20 weeks with design, copy, and marketing work.

---

## Deployment Stack

| Service | Purpose | Cost at launch |
|---------|---------|---------------|
| Vercel | Hosting (Next.js) | Free |
| Supabase | Database, auth, RLS | Free (Pro $25/month later) |
| Stripe | Payments | Per-transaction only |
| Cloudflare | DNS | Free |
| Resend | Transactional email | Free (100/day) |
| Buttondown | Marketing email | Free (100 subscribers) |
| Sentry | Error tracking | Free tier |

---

## Compliance Positioning

PerFi is **not** a banking app, investment platform, or Open Banking product. It does not move money, sync with bank APIs, or offer regulated financial advice. These are product principles, not temporary limitations.

PerFi is positioned as a **tracking and planning tool**. All copy must avoid:
- "We recommend" or "you should" for financial decisions
- Debt payoff strategies or prioritisation advice
- Budget amount suggestions
- Calling cashflow forecasting "financial planning"
- Any language implying regulated financial advice

Footer and terms must include: "PerFi is a tracking and planning tool. It does not provide financial advice."

---

## Post-v1 Roadmap (High Level)

| Priority | Feature |
|----------|---------|
| v1.1 | Resend email integration, dark mode, notifications (bill reminders), annual billing, recurring transaction templates, Setup assistant (re-onboarding), bill category auto-suggestion, account reordering, category icon picker |
| v1.2 | OAuth (Google/Apple), audit logging, advanced reporting |
| v2 | Shared workspaces, partner invites, Side Business workspace type |
| Later | Open Banking (optional), mobile native apps, receipt upload, multi-currency, API access for power users, irregular income tools (freelancer/gig) |

---

## Document Index

| File | Contents |
|------|----------|
| `phase-1-product-definition.md` | Product positioning, principles, audience, scope, risks, copy |
| `phase-2-ia-flows-pricing.md` | IA, routes, user flows, pricing, onboarding, demo, landing page |
| `phase-3-data-schema-security.md` | Schema (17 tables), RLS, auth, admin, Stripe, benefits |
| `phase-4-frontend-ux-admin.md` | Architecture, components, UX, accessibility, all page designs |
| `phase-5-roadmap-handoff.md` | Build order, risks, deployment, email tools, launch path, errata |
| `final-master-plan.md` | This file — consolidated reference |
| `working-notes.md` | Progress log, open/resolved questions |
| `phase-[1-5]-checkpoint.md` | Per-phase summaries and audit results |

---

*This plan is ready for implementation.*

*Created: 2026-03-30*

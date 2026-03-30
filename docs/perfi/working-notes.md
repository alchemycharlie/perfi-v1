# PerFi — Working Notes

## Progress Log

| Date       | Phase | Section                              | Status   |
|------------|-------|--------------------------------------|----------|
| 2026-03-30 | 1     | Working notes initialised            | Done     |
| 2026-03-30 | 1     | Product definition document written  | Done     |
| 2026-03-30 | 1     | Checkpoint summary written           | Done     |
| 2026-03-30 | 1     | Phase 1 committed                    | Done     |
| 2026-03-30 | 2     | IA — marketing, app, admin           | Done     |
| 2026-03-30 | 2     | Route structure (Next.js App Router) | Done     |
| 2026-03-30 | 2     | User flows (13 flows)                | Done     |
| 2026-03-30 | 2     | Pricing and feature gating           | Done     |
| 2026-03-30 | 2     | Workspace model                      | Done     |
| 2026-03-30 | 2     | Onboarding strategy                  | Done     |
| 2026-03-30 | 2     | Demo environment and walkthrough     | Done     |
| 2026-03-30 | 2     | Landing page and FAQ/waitlist        | Done     |
| 2026-03-30 | 2     | Checkpoint summary written           | Done     |
| 2026-03-30 | 2     | Phase 2 committed                    | Done     |
| 2026-03-30 | 3     | Tenancy model                        | Done     |
| 2026-03-30 | 3     | Workspace access model               | Done     |
| 2026-03-30 | 3     | Supabase data model                  | Done     |
| 2026-03-30 | 3     | Core entities and relationships      | Done     |
| 2026-03-30 | 3     | Schema outline (17 tables)           | Done     |
| 2026-03-30 | 3     | Roles and permissions                | Done     |
| 2026-03-30 | 3     | Admin access model                   | Done     |
| 2026-03-30 | 3     | Auth approach                        | Done     |
| 2026-03-30 | 3     | Protected route model                | Done     |
| 2026-03-30 | 3     | Row Level Security strategy          | Done     |
| 2026-03-30 | 3     | Privacy and security essentials      | Done     |
| 2026-03-30 | 3     | Auditability and shared workspaces   | Done     |
| 2026-03-30 | 3     | Benefits as income type              | Done     |
| 2026-03-30 | 3     | Stripe subscription model            | Done     |
| 2026-03-30 | 3     | Checkpoint summary written           | Done     |
| 2026-03-30 | 3     | Phase 3 committed                    | Done     |
| 2026-03-30 | 4     | Next.js App Router architecture      | Done     |
| 2026-03-30 | 4     | Unified repo structure               | Done     |
| 2026-03-30 | 4     | Route groups and layouts             | Done     |
| 2026-03-30 | 4     | Tailwind and design system           | Done     |
| 2026-03-30 | 4     | Shared component strategy            | Done     |
| 2026-03-30 | 4     | Data fetching and mutation           | Done     |
| 2026-03-30 | 4     | Forms strategy                       | Done     |
| 2026-03-30 | 4     | Charting and visualisation           | Done     |
| 2026-03-30 | 4     | Neurodiversity-aware UX              | Done     |
| 2026-03-30 | 4     | Accessibility principles             | Done     |
| 2026-03-30 | 4     | Dashboard UX approach                | Done     |
| 2026-03-30 | 4     | Empty states and walkthrough         | Done     |
| 2026-03-30 | 4     | Landing page structure               | Done     |
| 2026-03-30 | 4     | Interactive preview ideas            | Done     |
| 2026-03-30 | 4     | Admin panel UX                       | Done     |
| 2026-03-30 | 4     | Email capture and contact forms      | Done     |
| 2026-03-30 | 4     | Checkpoint summary written           | Done     |
| 2026-03-30 | 4     | Phase 4 committed                    | Done     |

## Open questions for future phases

- "Features" marketing nav link: currently an anchor scroll. May become a dedicated page post-v1.
- Dark mode: CSS variables are in place (Phase 4). Ship dark mode post-v1.
- Notifications: high value for bill/pay date reminders — revisit for v1.1.
- Annual billing plan: deferred from v1. Consider for v1.1 or v2.
- Transaction balance updates: recommend DB trigger on transactions to update accounts.balance. Document in Phase 5.
- Budget spent calculation: application logic filtering transactions by calendar month. Document approach in Phase 5.
- Users with zero workspaces: middleware redirects to onboarding, but app must handle gracefully.
- Recurring date calculation: utility function in lib/utils/dates.ts. Document in Phase 5.
- Cloudflare + Server Actions: must verify compatibility before committing. Fallback: Vercel.
- Recharts code-splitting: dynamic import on Analytics and Dashboard to avoid loading on marketing pages.
- Mobile dashboard density: 7 cards may be too many. Consider collapsing some on small screens.
- Email service for waitlist confirmations: fast-follow with Resend integration.

## Resolved questions

- Admin panel MVP scope: defined in Phase 2 section 3.
- Onboarding demo data content: specified in Phase 2 section 9.
- Debt tracking placement: standalone page at `/app/debt`.
- Bills vs Subscriptions: merged into single page `/app/bills`.
- CSV export free vs pro: confirmed in Phase 3 — Free = transactions only, Pro = all data.
- Tenancy model: workspace-scoped, not user-scoped.
- Benefits schema: same table as employment, nullable benefit_type column.
- Admin access: service_role, cannot modify user financial data.
- Account deletion: cascade delete through all workspace data + Supabase Auth deletion.
- Soft delete: no soft deletes in v1 — hard delete with cascades.
- profiles.is_disabled: added to schema, checked in middleware.
- Tour tracking: profiles.preferences jsonb includes has_seen_tour key.
- MRR for admin dashboard: calculated at query time from active Pro subscriptions.
- Component library: Radix UI + Tailwind + shadcn patterns (owned, not dependency).
- State management: no library — Server Components + React context.
- Charting: Recharts (SVG, accessible, SSR-friendly).
- Landing page preview: tabbed approach for v1, upgradeable to scroll-based later.
- Waitlist invites: manual for v1, Resend integration as fast-follow.
- CSV export UX: in Settings, Free = transactions only, Pro = all data types.
- Undo: toast-based for single-item deletions (5-second window).
- Onboarding UX: 5-step flow fully designed in Phase 4 section 17.3.
- Workspace switcher: dropdown in top bar with workspace list + create action.
- Settings/billing: sections defined, Stripe Customer Portal for payment management.
- Goals UX distinction: type selector on creation, type badges in list, different progress display.
- Cashflow calendar: day cells with dots, click-to-expand detail, sparkline, mobile list fallback.
- Auth: httpOnly cookies, signup triggers, middleware checks all referenced from Phase 3.
- Stripe: upgrade via Checkout, cancel via API, webhook handler for 5 events.
- Entitlements: all 9 limits mapped to specific UI enforcement points with UpgradeBanner.

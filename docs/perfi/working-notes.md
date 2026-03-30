# PerFi — Working Notes

## Progress Log

| Date       | Phase | Section                              | Status |
| ---------- | ----- | ------------------------------------ | ------ |
| 2026-03-30 | 1     | Working notes initialised            | Done   |
| 2026-03-30 | 1     | Product definition document written  | Done   |
| 2026-03-30 | 1     | Checkpoint summary written           | Done   |
| 2026-03-30 | 1     | Phase 1 committed                    | Done   |
| 2026-03-30 | 2     | IA — marketing, app, admin           | Done   |
| 2026-03-30 | 2     | Route structure (Next.js App Router) | Done   |
| 2026-03-30 | 2     | User flows (13 flows)                | Done   |
| 2026-03-30 | 2     | Pricing and feature gating           | Done   |
| 2026-03-30 | 2     | Workspace model                      | Done   |
| 2026-03-30 | 2     | Onboarding strategy                  | Done   |
| 2026-03-30 | 2     | Demo environment and walkthrough     | Done   |
| 2026-03-30 | 2     | Landing page and FAQ/waitlist        | Done   |
| 2026-03-30 | 2     | Phase 2 committed                    | Done   |
| 2026-03-30 | 3     | Tenancy model                        | Done   |
| 2026-03-30 | 3     | Workspace access model               | Done   |
| 2026-03-30 | 3     | Supabase data model                  | Done   |
| 2026-03-30 | 3     | Core entities and relationships      | Done   |
| 2026-03-30 | 3     | Schema outline (17 tables)           | Done   |
| 2026-03-30 | 3     | Roles and permissions                | Done   |
| 2026-03-30 | 3     | Admin access model                   | Done   |
| 2026-03-30 | 3     | Auth approach                        | Done   |
| 2026-03-30 | 3     | Protected route model                | Done   |
| 2026-03-30 | 3     | Row Level Security strategy          | Done   |
| 2026-03-30 | 3     | Privacy and security essentials      | Done   |
| 2026-03-30 | 3     | Auditability and shared workspaces   | Done   |
| 2026-03-30 | 3     | Benefits as income type              | Done   |
| 2026-03-30 | 3     | Stripe subscription model            | Done   |
| 2026-03-30 | 3     | Phase 3 committed                    | Done   |
| 2026-03-30 | 4     | Next.js App Router architecture      | Done   |
| 2026-03-30 | 4     | Unified repo structure               | Done   |
| 2026-03-30 | 4     | Route groups and layouts             | Done   |
| 2026-03-30 | 4     | Tailwind and design system           | Done   |
| 2026-03-30 | 4     | Shared component strategy            | Done   |
| 2026-03-30 | 4     | Data fetching and mutation           | Done   |
| 2026-03-30 | 4     | Forms strategy                       | Done   |
| 2026-03-30 | 4     | Charting and visualisation           | Done   |
| 2026-03-30 | 4     | Neurodiversity-aware UX              | Done   |
| 2026-03-30 | 4     | Accessibility principles             | Done   |
| 2026-03-30 | 4     | Dashboard UX approach                | Done   |
| 2026-03-30 | 4     | Empty states and walkthrough         | Done   |
| 2026-03-30 | 4     | Landing page structure               | Done   |
| 2026-03-30 | 4     | Interactive preview ideas            | Done   |
| 2026-03-30 | 4     | Admin panel UX                       | Done   |
| 2026-03-30 | 4     | Email capture and contact forms      | Done   |
| 2026-03-30 | 4     | 16 supplementary gap fixes           | Done   |
| 2026-03-30 | 4     | Phase 4 committed                    | Done   |
| 2026-03-30 | 5     | Implementation roadmap (6 phases)    | Done   |
| 2026-03-30 | 5     | Build order and timeline             | Done   |
| 2026-03-30 | 5     | Technical priorities for MVP         | Done   |
| 2026-03-30 | 5     | Lean launch path                     | Done   |
| 2026-03-30 | 5     | Risks and founder warnings           | Done   |
| 2026-03-30 | 5     | Complexity underestimation           | Done   |
| 2026-03-30 | 5     | Postponement list                    | Done   |
| 2026-03-30 | 5     | Email and campaign tools             | Done   |
| 2026-03-30 | 5     | Deployment recommendation            | Done   |
| 2026-03-30 | 5     | Handoff summary                      | Done   |
| 2026-03-30 | 5     | Final master plan                    | Done   |
| 2026-03-30 | 5     | Phase 5 committed                    | Done   |

## All open questions — resolved

All questions from previous phases have been resolved in Phase 5 or documented as post-v1 decisions:

- Transaction balance updates: DB trigger (Phase 5 section 3)
- Budget spent calculation: query-time SUM with calendar month filter (Phase 5 section 3)
- Recurring date calculation: `getNextOccurrences()` utility function (Phase 5 section 3)
- Deployment: Vercel (changed from Cloudflare — Phase 5 section 9)
- Email tooling: Resend (transactional) + Buttondown (marketing) (Phase 5 section 8)
- Dark mode: post-v1.1, CSS variables ready
- Notifications: post-v1.1
- Annual billing: post-v1.1
- Users with zero workspaces: middleware redirects to onboarding
- Recharts code-splitting: dynamic import on Analytics and Dashboard
- Mobile dashboard density: bottom tab bar decided, 7 cards stack on mobile

## Planning complete

All 5 phases + final master plan are committed. The planning pack is ready for implementation.

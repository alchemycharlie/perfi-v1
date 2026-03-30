# PerFi — Phase 5: Roadmap, Risks, Deployment Summary, and Final Handoff

## 1. Phase-by-Phase Implementation Roadmap

Implementation is split into 6 build phases. Each phase results in a deployable, testable state. No phase depends on completing all of the previous phase's polish — each targets a minimum viable slice.

### Build Phase A: Foundation (Estimated: 1–2 weeks)

**Goal**: Deployable skeleton with auth, database, and one working route per surface.

| Task | Detail |
|------|--------|
| Initialise Next.js project with App Router | Tailwind, TypeScript, ESLint, Prettier |
| Set up Supabase project | Create project, configure auth settings, email templates |
| Configure environment variables | `.env.local`, `.env.example`, Supabase keys, Stripe keys (test mode) |
| Create all 17 database tables | SQL migrations in `supabase/migrations/` |
| Set up RLS policies | Standard workspace membership pattern on all tables |
| Create database triggers | On signup: create profile + subscription. On transaction CUD: update account balance. |
| Set up auth | Supabase Auth with email+password, email verification, `@supabase/ssr` middleware |
| Create Supabase client files | `lib/supabase/client.ts`, `server.ts`, `middleware.ts`, `admin.ts` |
| Create root layout, middleware.ts | Auth guards, `is_disabled` check, onboarding redirect, admin role check |
| Create route group layouts | `(marketing)`, `(auth)`, `app/`, `admin/` with placeholder pages |
| Deploy to Cloudflare (or Vercel) | Verify Server Actions work. If Cloudflare fails, switch to Vercel now. |
| Set up CI | Linting, type checking, axe-core accessibility checks |

**Exit criteria**: User can sign up, log in, see an empty dashboard, and be redirected correctly by middleware. Marketing home page renders. Admin route is protected.

### Build Phase B: Marketing Site + Waitlist (Estimated: 1–2 weeks)

**Goal**: Public-facing site is live and capturing leads.

| Task | Detail |
|------|--------|
| Landing page | Hero, problem, features, differentiators, pricing, trust, FAQ, final CTA |
| Product preview | Tabbed screenshot showcase (4 tabs) |
| Pricing page | Free vs Pro comparison table |
| FAQ page | Accordion component, grouped by topic (Phase 2 section 10 questions) |
| About page | Mission, founder story, product principles |
| Contact page + API route | Form → `contact_submissions` table |
| Waitlist page + API route | Form → `waitlist_entries` table, honeypot anti-spam |
| Legal pages | Privacy policy, terms of service (draft content) |
| Marketing header + footer | Navigation, CTAs, responsive |
| SEO basics | Meta tags, Open Graph, sitemap, robots.txt |

**Exit criteria**: Marketing site is live, waitlist is capturing emails, contact form works, pricing is public. All marketing copy reviewed for compliance positioning (tracking/planning, not advice — see section 5).

### Build Phase C: Core App — Accounts, Transactions, Categories (Estimated: 2–3 weeks)

**Goal**: Users can create accounts, add transactions, and manage categories. The core CRUD loop works.

| Task | Detail |
|------|--------|
| Onboarding flow | 5-step progressive flow (Phase 4 section 17.3) |
| Demo data seed | Script to populate workspace with Phase 2 section 9 demo data |
| Demo banner | `DemoBanner` component with "Clear demo data" action |
| Guided tour | 4-step tooltip walkthrough for demo users |
| App layout | Sidebar, top bar, workspace switcher, quick-add button, user menu |
| Mobile layout | Bottom tab bar, responsive sidebar |
| Accounts page | Card grid, add account form, account detail page |
| Transactions page | List with date grouping, filters, search, load-more pagination |
| Quick-add transaction | Slide-out panel from top bar |
| Categories | Default seeding per workspace type, category management in Settings |
| Dashboard | Total balance, account cards, recent transactions |
| Empty states | All pages have empty state components |
| Error pages | 404, 500, global error boundary |
| Loading skeletons | Per-page skeleton components |

**Exit criteria**: User can complete onboarding, explore demo data, create accounts, add transactions, manage categories, and view a working dashboard.

### Build Phase D: Budgeting, Bills, Income, Goals, Debt (Estimated: 2–3 weeks)

**Goal**: All financial tracking features are functional.

| Task | Detail |
|------|--------|
| Budgets page | Category budgets, progress bars, month selector, spent calculation |
| Bills page | Add bill, upcoming section, all bills list, subscription badge |
| Income page | Add source (employment/benefits/other), named UK benefit types, frequency, pay dates |
| Goals page | Create savings/financial goals, type distinction, goal detail with contributions |
| Debt page | Add debt, balance cards, linked to goals |
| Cashflow calendar | Custom calendar grid, day dots, click-to-expand detail, projected balance |
| Dashboard additions | Next pay day card, upcoming bills card, budget status card, goals progress card |
| Pay date tracking | Cross-cutting: income page, dashboard, cashflow calendar |
| Recurring date utility | `lib/utils/dates.ts` — project future dates from frequency + anchor |
| Settings page | Profile, workspace settings, preferences, export, tour replay, account deletion |
| CSV export | Server Action generating CSV, free vs pro gating |

**Exit criteria**: All v1 financial features are functional. User can track a complete financial picture.

### Build Phase E: Payments, Entitlements, Admin (Estimated: 1–2 weeks)

**Goal**: Stripe billing works, plan limits are enforced, admin panel is operational.

| Task | Detail |
|------|--------|
| Stripe integration | Checkout session creation, webhook handler (5 events), Customer Portal link |
| Billing page | Upgrade, cancel, resume, payment status display |
| Entitlement enforcement | All 9 plan limits checked server-side and client-side |
| UpgradeBanner component | Inline banners at all gating points |
| Admin dashboard | StatCards, signup chart, plan distribution |
| Admin users | DataTable, search, filter, user detail, disable/enable, notes |
| Admin waitlist | DataTable, search, bulk invite, export CSV |
| Admin subscriptions | DataTable, summary row, Stripe Dashboard link |
| Admin support | Notes list, contact submissions |
| Admin system | Feature flags, maintenance mode |

**Exit criteria**: Users can upgrade/downgrade, plan limits are enforced, admin can manage the product.

### Build Phase F: Polish, Accessibility, Launch Prep (Estimated: 1–2 weeks)

**Goal**: Production-ready. Accessible. Launched.

| Task | Detail |
|------|--------|
| Accessibility audit | axe-core full scan, keyboard navigation test, screen reader spot-check |
| WCAG AA fixes | Fix any contrast, focus, label, or semantic issues found |
| Undo support | Toast-based undo for single-item deletions |
| Analytics page | Charts: spending by category, over time, income vs expenses. Free vs Pro layouts |
| Performance pass | Lighthouse audit, code-split Recharts, image optimisation, font optimisation |
| Responsive QA | Test all pages at mobile, tablet, desktop breakpoints |
| Legal review | Privacy policy and terms of service final content |
| Compliance check | Ensure all copy positions PerFi as tracking/planning, not advice |
| Email templates | Customise Supabase Auth email templates (verification, reset, magic link) |
| Production deployment | Environment variables, domain, SSL, Stripe live keys |
| Monitoring | Error tracking (Sentry or similar), basic uptime monitoring |
| Launch comms | Email waitlist, social media, launch day plan |

**Exit criteria**: Product is live, accessible, monitored, and accepting real users.

---

## 2. Recommended Build Order

The build order prioritises early deployability and fast feedback loops.

```
Week 1–2:   Phase A — Foundation
              Deploy skeleton. Verify Cloudflare/Vercel. Auth works.

Week 2–4:   Phase B — Marketing + Waitlist
              Go live with landing page. Start capturing leads.
              (Can run in parallel with Phase C start)

Week 3–6:   Phase C — Core App
              Accounts + Transactions + Dashboard.
              This is the largest phase. The app becomes usable.

Week 6–9:   Phase D — Full Financial Features
              Budgets, bills, income, goals, debt, cashflow.
              Complete the product surface.

Week 9–11:  Phase E — Payments + Admin
              Stripe billing. Entitlements. Admin panel.
              Product becomes commercial.

Week 11–12: Phase F — Polish + Launch
              Accessibility. Performance. Legal. Go live.
```

**Total estimated calendar time: 10–14 weeks for a solo founder working full-time.**

This is an estimate, not a commitment. Adjust based on actual velocity after Phase A.

### Parallelism opportunity

Phase B (marketing site) can start immediately after Phase A deploys, and Phase C can begin before Phase B is fully polished. The marketing site and the app share the same repo but different route groups — they do not block each other.

---

## 3. Technical Priorities for MVP

### Must-have before any user sees the product

1. **RLS on every table.** Non-negotiable. If RLS is broken, users can see each other's data. Test this before anything else.
2. **Auth middleware.** Protected routes must work. Onboarding redirect must work. Admin gating must work.
3. **Database triggers.** Profile + subscription creation on signup. Account balance update on transaction changes.
4. **Stripe webhook signature verification.** If webhooks are not verified, anyone can fake subscription events.
5. **Input validation (Zod).** All Server Actions validate input. No raw user input hits the database.

### Must-have before public launch

6. **Email verification.** Users must verify their email before accessing the app.
7. **HTTPS.** Enforced via Cloudflare/Vercel. No exceptions.
8. **Error pages.** 404 and 500 must not expose stack traces.
9. **WCAG AA compliance.** Tested, not assumed.
10. **Privacy policy and terms of service.** Must be published before collecting user data.

### Important but can ship 1 week after launch

11. Undo support (toast-based)
12. Analytics page (charts)
13. CSV export
14. Admin analytics (signup chart, plan distribution chart)

### Implementation notes deferred from Phase 3

These were flagged as "document in Phase 5":

**Transaction balance trigger**: Use a Postgres trigger on the `transactions` table that runs AFTER INSERT, UPDATE, DELETE. On insert/delete, adjust `accounts.balance` by the transaction amount. On update, adjust by the delta. This is more reliable than application logic because it cannot be bypassed.

**Budget spent calculation**: Application logic in the budgets page Server Component. Query: `SELECT category_id, SUM(amount) FROM transactions WHERE workspace_id = ? AND type = 'expense' AND date >= [first of month] AND date < [first of next month] GROUP BY category_id`. Compare against `budgets.amount` for each category.

**Recurring date calculation**: Utility function `getNextOccurrences(anchorDate, frequency, count)` in `lib/utils/dates.ts`. Takes a base date and frequency, returns an array of future dates. Used by the cashflow calendar to project income and bill events.

---

## 4. Leanest Smart Launch Path

### What "lean" means here

The leanest path is not "ship the least possible" — it is "ship the most value with the least wasted effort." PerFi's value proposition depends on the core app being genuinely useful. A marketing site with no product behind it is not a launch.

### The lean launch sequence

```
1. Deploy marketing site + waitlist            (Week 2–3)
   → Start building an audience before the app is ready
   → Validate messaging and positioning with real traffic

2. Invite 5–10 beta users from waitlist        (Week 7–8)
   → Core app functional (accounts, transactions, budgets, bills, income)
   → No Stripe yet — all beta users on "free" manually
   → Collect feedback on UX, ND principles, manual entry friction

3. Add Stripe + entitlements                   (Week 9–10)
   → Billing works, plan limits enforced
   → Beta users can upgrade

4. Public launch                               (Week 11–12)
   → Accessibility audit complete
   → Legal pages live
   → Email waitlist with launch announcement
   → Open signups
```

### What can be cut for faster launch (if needed)

| Feature | Impact of deferring | Risk |
|---------|-------------------|------|
| Analytics page (charts) | Low — users survive without trend charts for 2 weeks | Low |
| Cashflow forecasting (Pro) | None — Pro feature, can add post-launch | None |
| Net worth tracking (Pro) | None — Pro feature | None |
| CSV export | Low — users can copy data manually briefly | Low |
| Guided tour | Low — empty states guide users adequately | Low |
| Financial goals (vs savings) | Medium — savings goals are the core; financial goals are a nice-to-have | Low |
| Debt page | Medium — users can track debt as a credit card account | Medium — loses the dedicated tracking UX |

**Do not cut**: Accounts, transactions, budgets, bills, income (incl. benefits), dashboard, onboarding, demo data. These are the core product.

---

## 5. Risks, Caveats, and Founder Warnings

### Real risks

**1. Manual entry fatigue is the #1 churn risk.**
Users will love the idea of PerFi and abandon it within 2 weeks if adding transactions feels tedious. The quick-add flow must be genuinely fast (under 5 seconds per transaction). Recurring bill templates help. But honestly: some percentage of users will always prefer automatic sync. That is fine — PerFi is not for everyone, and trying to be will kill the product.

**Mitigation**: Obsess over the quick-add UX. Test it with real users in beta. If 5 seconds is not achievable, rethink the form.

**2. "Why not a spreadsheet?" is a real objection.**
PerFi must provide clear value over a Google Sheet. The cashflow calendar, budget visualisations, goal tracking, and mobile-friendly responsive design are the answer. If these feel weak at launch, the objection wins.

**Mitigation**: The dashboard and cashflow calendar are the "aha moment" features. Prioritise their quality.

**3. Accessibility claims create accountability.**
Marketing PerFi as neurodiversity-conscious and accessible means users will hold the product to that standard. If the app has keyboard traps, poor contrast, or screen reader issues, the backlash will be worse than if accessibility was never mentioned.

**Mitigation**: axe-core in CI. Manual keyboard test before launch. Do not claim WCAG AA until you have tested it.

**4. Solo founder scope is real.**
This plan describes a genuine product with ~30 pages, 17 database tables, Stripe billing, an admin panel, and a marketing site. For a solo founder, 10–14 weeks is optimistic if you also need to handle design, copywriting, legal, and marketing. Budget 16–20 weeks realistically, or cut scope.

**Mitigation**: Ship Phase B (marketing + waitlist) early. This buys time while building the app, and validates demand.

**5. Cloudflare deployment is the riskiest technical bet.**
Next.js App Router on Cloudflare Workers via `@cloudflare/next-on-pages` is functional but not fully mature. Server Actions, middleware, and SSR all work but with caveats. If it fails, the migration to Vercel is straightforward (same Next.js project, different hosting) but costs a day of reconfiguration.

**Mitigation**: Test deployment in Build Phase A. If Server Actions do not work reliably on Cloudflare, switch to Vercel immediately and do not look back.

### Compliance caveats

**PerFi is not a banking app, not an investment platform, and not an Open Banking product.** It does not move money, sync with bank APIs, or offer regulated financial advice. These are not temporary limitations — they are product principles. All copy, landing pages, and in-app messaging must reflect this.

**PerFi must never position itself as financial advice.** All copy, onboarding, and product UI must be framed as:
- Tracking
- Planning
- Organisation
- Visibility
- General informational guidance

It must never be framed as:
- Financial advice
- Regulated advice
- Investment advice
- Debt counselling
- A regulated recommendation engine

**Specific risks**:
- Do not use phrases like "we recommend" or "you should" when referring to financial decisions
- Do not provide debt payoff strategies (e.g. "pay off highest interest first") — only track progress
- Do not suggest budget amounts — let users set their own
- Do not call cashflow forecasting "financial planning" — call it "cashflow visibility"
- Include a disclaimer in the footer and terms: "PerFi is a tracking and planning tool. It does not provide financial advice."

---

## 6. Where Complexity Is Being Underestimated

### The cashflow calendar is harder than it looks

The cashflow calendar is a custom component (not a charting library feature). It requires:
- A CSS grid that handles months of varying length
- Projecting future dates from frequency + anchor for every income source and bill
- Calculating a running projected balance across each day
- Click-to-expand detail panels
- Responsive behaviour (grid on desktop, list on mobile)
- Accessibility (keyboard navigation, screen reader announcements for day events)

This is likely 2–4 days of focused work, not a 2-hour task. Plan accordingly.

### Stripe webhook handling has hidden complexity

Stripe webhooks sound simple (receive JSON, update database) but in practice:
- Webhook events can arrive out of order
- The same event can be retried multiple times (must be idempotent)
- `checkout.session.completed` must create or update a subscription, not duplicate it
- `customer.subscription.deleted` must handle both voluntary cancellation and failed payment expiry
- Testing requires Stripe CLI for local webhook forwarding

Budget a full day for webhook handler implementation and testing.

### RLS policy performance at scale

The standard RLS pattern (`workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())`) works well at v1 scale. But if a user has 5 workspaces and the transactions table grows to 100k+ rows, this subquery runs on every row access.

**Not a v1 problem** — but be aware. If performance degrades later, options include:
- Materialized views
- Caching the user's workspace IDs in the JWT custom claims
- Query-level workspace_id filtering (redundant with RLS, but reduces the rows RLS evaluates)

### Demo data seeding and clearing is fiddly

Seeding demo data means inserting ~50 rows across 8 tables with correct foreign key references (accounts → transactions, categories → budgets, etc.). Clearing demo data means deleting everything in a workspace without breaking foreign key constraints (delete in reverse order, or use CASCADE).

This is not complex but it is error-prone. Write it once carefully, test it thoroughly.

### Category seeding per workspace type

When a workspace is created, default categories must be seeded based on workspace type (Personal vs Personal + Household). This is a database operation triggered by workspace creation — either a Postgres function or application logic in the onboarding Server Action. It needs to handle:
- Two different category sets
- Setting `is_default = true` on seeded categories
- Not duplicating if onboarding is replayed

---

## 7. What Should Be Postponed

### Confirmed post-v1 (do not build)

| Feature | Why postponed | When to revisit |
|---------|---------------|-----------------|
| Open Banking / bank sync | Core principle: manual-first | v2 or never — only if market demands it |
| Third-party finance APIs | No external dependencies in v1 | v2 or never |
| Payment initiation / money movement | Out of product scope; regulatory implications | Never — not the product |
| OAuth (Google/Apple sign-in) | Adds complexity, minimal v1 benefit | v1.1 — easy to add via Supabase |
| Dark mode | Design system supports it (CSS vars), but shipping it doubles visual QA | v1.1 — when design system is stable |
| Notifications (email/push) | Requires infrastructure (email service, push registration) | v1.1 — high value for bill reminders |
| Annual billing | Adds Stripe complexity (proration, plan switching) | v1.1 — when monthly billing is proven |
| Partner invites / shared workspaces | Schema supports it, but collaboration UX is a full project | v2 |
| Side Business workspace type | Needs different category sets, possibly tax-related features | v2 |
| Mobile native apps | Web-first, responsive serves mobile users | v2 — only if demand is proven |
| Receipt upload | Storage, OCR, or manual attachment — all add complexity | v2 |
| Multi-currency | UK-first principle: GBP only | v2 |
| AI features | Manual-first principle | v2 or never |
| Audit logging | Schema supports it, but adds write overhead | v1.1 — when shared workspaces are added |

### Can ship 1–2 weeks after launch (fast-follows)

| Feature | Why it can wait | Priority |
|---------|----------------|----------|
| Resend email integration | Manual waitlist invites work for launch | High — do within 2 weeks |
| Waitlist confirmation emails | On-screen confirmation is sufficient at launch | High |
| Analytics charts | Users need time to accumulate data anyway | Medium |
| Undo support | Confirmation dialogs protect against accidents | Medium |
| CSV export | Low urgency — users can screenshot or manually copy | Low |
| CSV import (Pro) | Listed in pricing but not in any build phase — defer to post-launch | Medium |

---

## 8. Recommended Email and Campaign Tool Choices

### Transactional email: Resend

**Why Resend**:
- Built for developers. Simple API. Excellent DX.
- React Email for template building (fits the Next.js stack)
- Generous free tier (100 emails/day, 3,000/month)
- Fast integration (npm package, one API key)
- Good deliverability

**What it handles**:
- Waitlist confirmation emails
- Waitlist invite emails (when admin sends invites)
- Optional: custom signup welcome email

**What it does NOT handle** (leave to Supabase Auth):
- Email verification
- Password reset
- Magic link

Supabase Auth sends these via its built-in email service (or can be configured to use a custom SMTP — point it at Resend if full branding is needed).

**Implementation effort**: 2–4 hours. Install `resend` package, create email templates with React Email, add API calls to waitlist invite and contact form handlers.

### Marketing / lifecycle email: Buttondown or Loops

For product updates, launch announcements, and ongoing waitlist nurture:

**Option A: Buttondown** (recommended for lean start)
- Simple, developer-friendly newsletter tool
- Free for first 100 subscribers
- Markdown-based emails
- No bloat, no complex automation
- Good for: launch announcement, monthly product updates, waitlist nurture

**Option B: Loops** (recommended if lifecycle email matters)
- Built for SaaS lifecycle email
- Event-driven (can trigger on signup, upgrade, etc.)
- Free for first 1,000 contacts
- More powerful than Buttondown, but more setup

**Recommendation for v1**: Start with **Buttondown** for simplicity. Import waitlist emails, send launch announcement, send occasional product updates. Switch to Loops later if lifecycle automation becomes important.

### Integration summary

```
Supabase Auth emails  →  Supabase built-in (or Resend SMTP)
  - Email verification
  - Password reset
  - Magic link

Transactional emails  →  Resend
  - Waitlist confirmation
  - Waitlist invite
  - Contact form acknowledgement

Marketing emails      →  Buttondown
  - Launch announcement
  - Product updates
  - Waitlist nurture
```

**Total email cost at launch: £0.** All tools have sufficient free tiers for v1 scale.

---

## 9. Deployment Recommendation Summary

### Primary recommendation: Vercel

**Changed from Cloudflare.** After careful assessment:

Cloudflare Pages/Workers is a capable platform, but deploying Next.js App Router with Server Actions, middleware, and SSR on Cloudflare introduces friction that a solo founder should not spend time debugging. The `@cloudflare/next-on-pages` adapter works but has documented limitations around Node.js API compatibility, Server Action edge cases, and middleware behaviour.

**Vercel is the path of least resistance for Next.js:**
- Zero-config deployment for Next.js App Router
- Server Actions, middleware, SSR all work natively
- Built-in analytics, logging, and preview deployments
- Free tier is generous (100GB bandwidth, serverless functions)
- Pro tier at $20/month if needed later

**If the founder strongly prefers Cloudflare**, test deployment in Build Phase A and switch to Vercel only if problems arise. But the recommendation is to start with Vercel and avoid the risk.

### Supabase

- **Supabase Free tier** for development and early launch (500MB database, 1GB file storage, 50,000 monthly active users)
- **Supabase Pro ($25/month)** when approaching limits or needing daily backups
- Region: choose closest to UK users (EU West — London or Frankfurt)

### Stripe

- **Stripe standard account** — no monthly fee, 1.4% + 20p per UK card transaction
- Start in **test mode** during development
- Switch to live mode only in Build Phase F (launch prep)
- Webhook endpoint: `/api/webhooks/stripe`

### Domain and DNS

- Register domain (e.g. `perfi.co.uk` or `getperfi.com`)
- DNS managed via Cloudflare (even if hosting on Vercel — Cloudflare DNS is excellent and free)
- SSL via Vercel (automatic) or Cloudflare (if proxied)

### Full deployment stack

```
Code repo          →  GitHub (single repo)
Hosting            →  Vercel (Next.js, SSR, Server Actions)
Database + Auth    →  Supabase (Postgres, Auth, RLS, Storage)
Payments           →  Stripe (Checkout, webhooks, Customer Portal)
DNS                →  Cloudflare (free DNS, optional proxy)
Transactional email→  Resend (waitlist, invites)
Marketing email    →  Buttondown (launch, updates)
Error tracking     →  Sentry (free tier)
Domain             →  Registrar of choice
```

**Monthly cost at launch: ~£0** (all free tiers). First paid upgrade likely Supabase Pro at $25/month when approaching 500MB database.

---

## 10. Final Implementation Handoff Summary

### What has been planned

Across Phases 1–5, the following has been fully specified:

| Area | Document | Key contents |
|------|----------|-------------|
| **Product definition** | Phase 1 | Positioning, audience, differentiators, principles, v1 scope, risks, copy |
| **Information architecture** | Phase 2 | 3 surfaces, 29 pages, 13 user flows, pricing tiers, onboarding, demo data, FAQ |
| **Data model and security** | Phase 3 | 17 tables, RLS policies, auth flow, Stripe webhooks, entitlements, benefits schema |
| **Frontend architecture** | Phase 4 | Repo structure, components, data fetching, forms, charts, accessibility, all page UX |
| **Roadmap and deployment** | Phase 5 | 6 build phases, deployment stack, email tooling, risks, launch path |

### The source of truth for implementation

When building, refer to these documents in this priority order:

1. **`final-master-plan.md`** — consolidated reference (see below)
2. **Phase 3** (`phase-3-data-schema-security.md`) — for all database, auth, and security decisions
3. **Phase 4** (`phase-4-frontend-ux-admin.md`) — for all frontend, UX, and component decisions
4. **Phase 2** (`phase-2-ia-flows-pricing.md`) — for user flows, pricing tiers, and onboarding details
5. **Phase 5** (`phase-5-roadmap-handoff.md`) — for build order, risks, and deployment
6. **Phase 1** (`phase-1-product-definition.md`) — for product principles and positioning (refer back when making trade-offs)

### What is NOT planned (and that is fine)

- Exact CSS values, pixel spacing, or colour codes beyond the design system tokens
- Copy for every button, label, and error message
- The actual SQL for every migration
- Test coverage targets or testing strategy beyond accessibility
- CI/CD pipeline configuration
- Monitoring and alerting thresholds

These are implementation details that are best decided in context, not pre-planned in a document.

### First steps after reading this document

1. Create the Next.js project (`npx create-next-app@latest perfi --typescript --tailwind --app`)
2. Create the Supabase project
3. Run the first SQL migration (create all 17 tables)
4. Set up auth and middleware
5. Deploy to Vercel
6. Start building Phase B (marketing site) while the app skeleton is live

---

*Document version: Phase 5 v1.0*
*Created: 2026-03-30*

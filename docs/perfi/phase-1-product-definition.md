# PerFi — Phase 1: Product Definition and Scope

## 1. Executive Product Summary

PerFi is a UK-focused personal finance planning SaaS built around manual tracking, budgeting, cashflow visibility, savings goals, debt awareness, and benefits-aware income tracking. It is designed from the ground up with neurodiversity-conscious UX and accessibility as defaults, not afterthoughts.

PerFi is not a banking app, an investment platform, or an Open Banking product. It does not move money, sync with bank APIs, or offer regulated financial advice. It is a deliberate, manual-first tool that gives users a calm, structured view of their financial life.

The product launches as a commercial SaaS from day one with a public marketing site, a freemium pricing model, waitlist capture, and an internal admin panel.

---

## 2. Refined Product Positioning

PerFi occupies a specific gap in the UK personal finance market: a modern, accessible, manual-first finance tracker that takes UK financial realities seriously — including benefits income, pay-date awareness, and GBP-only simplicity.

Most personal finance apps fall into one of two camps:

1. **Open Banking aggregators** (Emma, Plum, Money Dashboard) — powerful but reliant on bank sync, which creates anxiety for some users, excludes cash and informal income, and adds API complexity.
2. **Generic budgeting tools** (YNAB, Goodbudget) — US-centric, not designed for UK tax, benefits, or pay structures, and rarely consider neurodivergent users.

PerFi sits between these: a UK-native, manual-first tool with a calm, accessible interface that respects the way real people in the UK actually manage money — including those on benefits, irregular income, or managing neurodivergent challenges with executive function and financial admin.

---

## 3. Core Value Proposition

**For UK consumers who want a clear, calm view of their personal finances without connecting their bank accounts**, PerFi is a manual-first budgeting and cashflow planning tool that makes financial tracking accessible, low-friction, and genuinely useful — especially for people underserved by existing apps.

Unlike Open Banking aggregators or US-centric budgeting tools, PerFi is built for UK financial realities, treats benefits as a first-class income type, and is designed with neurodiversity and accessibility at its core.

---

## 4. Target Audience and User Segments

### Primary segments

| Segment | Description | Key needs |
|---------|-------------|-----------|
| **UK young professionals** | 22–35, employed, tech-native, want to budget and save | Simple budgeting, savings goals, cashflow visibility |
| **UK families and households** | Managing household budgets, bills, childcare costs | Bill tracking, direct debit dates, pay-date awareness |
| **Neurodivergent users** | ADHD, autism, dyslexia — underserved by cluttered finance apps | Low cognitive load, predictable UI, progressive disclosure, calm design |
| **Benefits-receiving individuals** | UC, PIP, child benefit, carer's allowance recipients | Benefits as income types, irregular payment tracking, no judgement |
| **Privacy-conscious users** | People who do not want to connect bank accounts to apps | Manual-first, no Open Banking requirement, local control |

### Secondary segments (post-v1 growth)

- Freelancers and gig workers with irregular income
- Students managing loans and part-time work
- Retirees tracking pensions and fixed incomes

---

## 5. Key Differentiators

1. **UK-native** — GBP only, built for UK pay structures, benefits system, and financial norms. Not a US app with a currency toggle.
2. **Manual-first** — No Open Banking, no bank sync, no API dependencies. Users are in full control of their data from day one.
3. **Benefits-aware income tracking** — Universal Credit, PIP, child benefit, carer's allowance, and other UK benefits treated as first-class income types with appropriate categorisation and tracking.
4. **Neurodiversity-conscious UX** — Designed to reduce cognitive overload, with predictable navigation, progressive disclosure, supportive empty states, and calm visual design.
5. **Accessibility by default** — Strong accessibility standards from launch, not bolted on later.
6. **Commercial SaaS from day one** — Public pricing, waitlist capture, admin tooling. Not a side project hoping to monetise later.

---

## 6. Product Principles

These principles govern all product decisions:

### 6.1 Manual first

- No Open Banking APIs in v1
- No bank sync, payment initiation, or money movement
- Users enter and manage their own data
- This is a feature, not a limitation — it creates trust, simplicity, and data ownership

### 6.2 UK first

- GBP only in v1
- Designed for UK pay structures (monthly, fortnightly, weekly, four-weekly)
- Supports UK-specific financial realities: council tax, benefits income, tax codes
- No multi-currency, no international features in v1

### 6.3 Neurodiversity and accessibility focused

- Reduce cognitive overload in every screen
- Clear information hierarchy — users should always know where they are and what to do next
- Predictable navigation — no surprise modals, no complex multi-step flows without clear progress
- Supportive empty states — never leave a user staring at a blank screen
- Progressive disclosure — show what matters now, reveal complexity only when needed
- Calm, uncluttered interface — whitespace is a feature
- Strong accessibility standards (WCAG 2.1 AA minimum)

### 6.4 Trust first

- Safe, serious, credible visual language
- No crypto aesthetics, no gimmicky fintech theatre
- Clear data handling and privacy messaging
- No dark patterns, no pressure tactics

### 6.5 Honest scope

- Ship what works, not what sounds impressive
- Do not promise features that are not built
- Do not over-scope v1 to appear competitive with funded aggregators
- Manual-first is the positioning, not an apology

---

## 7. UK-Specific Angle

PerFi is built for the UK market specifically. This is not a generic budgeting tool localised for the UK — it is designed around UK financial realities from the start.

### What "UK-first" means in practice

- **Currency**: GBP only. No currency conversion, no multi-currency wallets.
- **Pay structures**: Support for monthly, fortnightly, weekly, and four-weekly pay cycles — all common in the UK.
- **Benefits income**: Universal Credit, PIP, child benefit, carer's allowance, ESA, housing benefit, council tax reduction, and other UK benefits treated as named income types.
- **UK financial calendar**: Awareness of common UK billing cycles, council tax months (typically 10-month cycles), and tax year boundaries.
- **Terminology**: "Current account" not "checking account". "Direct debit" not "auto-pay". UK-native language throughout.
- **No US assumptions**: No ZIP codes, no SSN references, no US tax categories, no USD defaults.

---

## 8. Benefits-Aware Income Tracking

### The problem

Most budgeting apps treat income as a single salary figure. For millions of UK residents, income is a mix of employment income and government benefits — and these arrive on different schedules, in different amounts, and sometimes unpredictably.

Existing apps either ignore benefits entirely, force users to categorise them manually as generic "other income", or conflate them with employment income. This creates an inaccurate picture of household cashflow.

### PerFi's approach

Benefits are treated as a first-class income type in PerFi:

- **Named benefit types**: Universal Credit, PIP, child benefit, carer's allowance, ESA, housing benefit, council tax reduction, and a user-defined "other benefit" option.
- **Separate tracking**: Benefits income is tracked alongside but distinct from employment income, giving users an accurate breakdown of their total household income.
- **Schedule awareness**: Benefits often arrive on different schedules (weekly, fortnightly, four-weekly, monthly). PerFi supports per-income-source frequency settings.
- **No judgement**: The interface treats benefits income with the same visual weight and dignity as employment income. No separate "benefits" section hidden in a sub-menu.
- **Cashflow impact**: Benefits income feeds into cashflow forecasting alongside all other income sources.

### Why this matters

- Approximately 6 million people in the UK claim Universal Credit alone.
- Benefits income is real income. Excluding it from budgeting tools creates an incomplete and unhelpful financial picture.
- This is a genuine differentiator — very few consumer finance apps handle this well.

---

## 9. Neurodiversity and Accessibility as Product Principles

### The problem

Most personal finance apps are designed for neurotypical users with strong executive function. They assume users can:

- Process dense dashboards of numbers
- Remember to check the app regularly
- Navigate complex multi-step workflows
- Tolerate visual clutter, animations, and cognitive load

For neurodivergent users — particularly those with ADHD, autism, dyslexia, or anxiety — these assumptions create barriers. Financial admin is already a high-friction task. Poor UX makes it harder.

### PerFi's approach

Neurodiversity-conscious design is not a separate mode or a toggle. It is the default experience:

- **Low cognitive load**: Every screen shows only what is needed. No dashboards with 15 widgets competing for attention.
- **Predictable navigation**: Consistent layout, consistent patterns. Users should be able to build muscle memory.
- **Progressive disclosure**: Start simple, reveal detail on demand. A transaction list does not need to show every field by default.
- **Supportive empty states**: When a section has no data, show a clear, friendly explanation of what it is for and how to get started. Never show a blank screen.
- **Calm visual design**: Muted colour palette, generous whitespace, readable typography. No flashing notifications, no aggressive red/green financial indicators.
- **Clear hierarchy**: One primary action per screen. Users should always know what the most important thing is.
- **Forgiving input**: Undo support where possible. Confirmation for destructive actions. No "are you sure?" fatigue — just sensible defaults.
- **Keyboard and screen reader support**: Full keyboard navigation, proper ARIA labels, screen reader tested.
- **WCAG 2.1 AA compliance**: Minimum standard from launch, with a path toward AAA where practical.

### Why this matters

- An estimated 15–20% of the UK population is neurodivergent.
- Financial anxiety disproportionately affects neurodivergent people.
- Designing for neurodivergent users creates a better experience for everyone — calmer, clearer, more usable.
- This is a genuine competitive advantage. Almost no consumer finance apps prioritise this.

---

## 10. v1 — In Scope

### Public marketing site

- Public landing page with product explanation
- Pricing page (free tier + £4.99/month paid tier)
- FAQ page
- Waitlist capture (email)
- Contact or support section
- SEO-ready structure

### Authentication and onboarding

- User authentication (sign up, log in, password reset)
- Progressive onboarding flow (encouraged but skippable)
- Demo data option or blank workspace start
- Onboarding captures: display name, workspace type, income amount/range, pay frequency, benefits tracking preference

### Core finance tracking

- Manual account creation (current account, savings, credit card, cash, investments)
- Manual transaction entry
- Transaction categorisation
- Recurring bills tracking
- Direct debit date tracking
- Pay date tracking

### Budgeting and goals

- Category-based budgeting
- Savings goals (set target, track progress)
- Financial goal setting and tracking
- Debt tracking (balances, minimum payments, progress)

### Cashflow and analytics

- Cashflow calendar view
- Key graphs and visualisations
- Analytics dashboard
- Subscription tracking

### Income

- Employment income tracking
- Benefits-aware income tracking (named UK benefit types)
- Per-source frequency settings

### Export

- CSV export

### Admin panel

- User management
- Waitlist management
- Subscription visibility
- Support handling tools
- Operational controls
- As fully featured as practical from launch

---

## 11. v1 — Out of Scope

The following are explicitly excluded from v1:

| Feature | Reason |
|---------|--------|
| Open Banking / bank sync | Manual-first principle; API complexity; trust concerns |
| Third-party finance APIs | Scope control; no external dependencies in v1 |
| Payment initiation / money movement | Out of product scope; regulatory implications |
| Receipt upload | Nice-to-have but not core; adds storage and OCR complexity |
| Multi-currency | UK-first principle; GBP only in v1 |
| Partner invites / shared family editing | Social features add significant complexity; post-v1 |
| Regulated financial advice | Legal and compliance risk; firmly out of scope |
| AI-driven finance automation | Scope creep risk; manual-first principle |
| Mobile native apps | Web-first in v1; responsive design serves mobile users |
| Notifications / reminders | Adds infrastructure complexity; consider for v1.1 |
| Dark mode | Desirable but not v1 critical; design for it but ship later |

---

## 12. Post-v1 Opportunities (High Level)

These are acknowledged opportunities for future versions, listed here to confirm they are intentionally deferred, not forgotten:

1. **Open Banking integration** — optional bank sync as an add-on, not a replacement for manual entry
2. **Mobile native apps** — iOS and Android, once the web app is stable
3. **Notifications and reminders** — bill due dates, budget alerts, pay day notifications
4. **Partner and family sharing** — shared workspaces with role-based access
5. **Receipt and document upload** — attach receipts to transactions
6. **Multi-currency support** — for users with foreign accounts or travel
7. **Dark mode** — increasingly expected; design system should accommodate it
8. **Advanced reporting** — custom date ranges, year-over-year comparisons, tax year summaries
9. **API access** — for power users and integrations
10. **Irregular income tools** — freelancer and gig economy specific features

---

## 13. Major Product Risks and Scope Traps

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Manual entry friction** — users may find manual entry tedious and churn | High | Excellent UX for quick entry; recurring transaction templates; demo data to show value fast |
| **"Why not just use a spreadsheet?"** — perceived value gap | Medium | Cashflow calendar, visualisations, goal tracking, and mobile-friendly responsive design provide clear value over spreadsheets |
| **Benefits tracking sensitivity** — users may feel uncomfortable tracking benefits | Medium | Non-judgemental language; benefits treated with equal dignity; optional — users are never required to categorise income as benefits |
| **Accessibility claims without delivery** — marketing accessibility without meeting standards damages trust | High | WCAG 2.1 AA compliance tested before launch; accessibility audit as part of release criteria |
| **Admin panel scope creep** — "as fully featured as practical" is vague | Medium | Define admin MVP clearly in Phase 2; prioritise user management, waitlist, and subscription visibility |
| **Pricing tier balance** — free tier too generous kills conversion; too restrictive kills adoption | Medium | Monitor usage patterns post-launch; be prepared to adjust tier boundaries |

### Scope traps to avoid

1. **"Just add Open Banking as optional"** — this is never simple. It introduces API dependencies, security requirements, regulatory considerations, and ongoing maintenance. Defer firmly.
2. **Over-engineering the analytics dashboard** — start with 3–5 key visualisations. Do not build a BI tool.
3. **Building a notification system in v1** — notifications require infrastructure (email, push, in-app) that is disproportionate to v1 scope.
4. **Trying to compete with funded aggregators on features** — PerFi wins on focus, accessibility, and UK-native design, not on feature count.
5. **Premature AI features** — "AI-powered insights" is a scope trap. Manual-first means human-driven decisions.

---

## 14. Recommended Positioning Copy

### Product positioning sentence

> PerFi is a UK-focused personal finance planner built for clarity, accessibility, and real life — no bank connections required.

### Homepage hero headline

> Your money. Your way. Finally, a finance app that works the way you do.

### Supporting subheadline

> PerFi is a calm, accessible personal finance tool built for the UK. Track your income — including benefits — manage budgets, and see your cashflow clearly. No bank sync needed. No clutter. Just clarity.

### Messaging pillars

1. **Manual-first simplicity** — You control your data. No bank connections, no API dependencies, no complexity you did not ask for.
2. **Built for the UK** — GBP, benefits income, direct debits, pay dates. Designed around how money actually works in the UK.
3. **Accessible by default** — Calm, clear, and designed for everyone — including neurodivergent users who deserve better financial tools.
4. **Honest personal finance** — No gimmicks, no dark patterns, no pressure. Just a straightforward tool that helps you understand your money.
5. **Ready from day one** — Real pricing, real features, real support. Not a beta experiment — a product you can rely on.

---

*Document version: Phase 1 v1.0*
*Created: 2026-03-30*

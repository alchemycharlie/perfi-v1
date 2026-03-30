# PerFi — Phase 2: Information Architecture, Flows, Pricing, and Onboarding

## 1. Information Architecture — Public Marketing Site

The marketing site is a static, SEO-optimised surface. It exists to explain the product, build trust, capture leads, and convert visitors to signups.

### Page inventory

| Page | Purpose | Key content |
|------|---------|-------------|
| **Home** `/` | Hero, value proposition, product preview, social proof, CTA | Headline, subheadline, feature highlights, interactive preview, waitlist/signup CTA |
| **Pricing** `/pricing` | Transparent tier comparison | Free vs Pro comparison table, FAQ about billing, CTA to sign up |
| **FAQ** `/faq` | Address objections and common questions | Grouped by topic: product, pricing, data/privacy, accessibility |
| **About** `/about` | Build trust, tell the story | Mission, founder story, product principles |
| **Contact** `/contact` | Support pathway | Contact form or email, expected response time |
| **Waitlist** `/waitlist` | Pre-launch lead capture | Email capture, optional "what interests you" checkboxes |
| **Legal** `/legal/privacy` `/legal/terms` | Compliance | Privacy policy, terms of service |

### Navigation structure

```
Header:  [Logo/Home]  Features  Pricing  FAQ  About  [Sign In]  [Get Started]
Footer:  Home · Pricing · FAQ · About · Contact · Privacy · Terms
```

- "Get Started" is the primary CTA throughout (leads to signup or waitlist depending on launch phase)
- "Sign In" is secondary, text-only link
- Mobile: hamburger menu with same items, "Get Started" remains visible as a button

### Content strategy notes

- Home page should include an **interactive product preview** — a static or lightly animated screenshot walkthrough showing the dashboard, transaction entry, and cashflow calendar. Not a full demo; just enough to visualise the product.
- Every page ends with a CTA section: "Ready to take control of your finances?" → Sign up / Join waitlist
- FAQ is grouped, not a flat list. Groups: Product, Pricing & Billing, Data & Privacy, Accessibility

---

## 2. Information Architecture — Authenticated App

The app is the core product surface. It must be calm, predictable, and easy to navigate. Navigation follows a flat sidebar pattern — no deeply nested menus.

### Primary navigation (sidebar)

```
Dashboard
Accounts
Transactions
Budgets
Bills & Subscriptions
Cashflow
Goals
Debt
Income
Analytics        [Pro badge if locked]
```

### Secondary navigation (top bar / user menu)

```
[Workspace switcher]    [Quick add: + Transaction]    [User avatar menu]
```

User avatar menu contains:
- Settings
- Workspace settings
- Subscription & billing
- Help / Support
- Sign out

### Page inventory — App

| Page | Route | Purpose |
|------|-------|---------|
| **Dashboard** | `/app/dashboard` | At-a-glance summary: balances, recent transactions, upcoming bills, budget status, goals progress |
| **Accounts** | `/app/accounts` | List all accounts; click into account detail |
| **Account detail** | `/app/accounts/[id]` | Transactions for that account, balance history |
| **Transactions** | `/app/transactions` | Full transaction list with filters, search, add new |
| **Budgets** | `/app/budgets` | Category budgets, progress bars, month selector |
| **Bills & Subscriptions** | `/app/bills` | Recurring bills, direct debits, subscriptions with due dates |
| **Cashflow** | `/app/cashflow` | Calendar view of income (incl. pay dates), expenses, and bills; projected balance |
| **Goals** | `/app/goals` | Savings goals (save toward a target) and financial goals (pay off debt, reduce spending) with progress tracking |
| **Goal detail** | `/app/goals/[id]` | Individual goal detail and contribution history |
| **Income** | `/app/income` | All income sources: employment, benefits, other. Per-source frequency and next pay date |
| **Analytics** | `/app/analytics` | Charts, trends, spending breakdown, net worth (Pro) |
| **Debt** | `/app/debt` | Debt balances, minimum payments, payoff progress |
| **Settings** | `/app/settings` | Profile, preferences, display name, workspace settings |
| **Billing** | `/app/settings/billing` | Subscription status, upgrade/downgrade, payment method |
| **Onboarding** | `/app/onboarding` | Progressive onboarding flow (shown post-signup) |

### Design principles for app IA

- **Flat navigation**: Every primary section is one click from the sidebar. No nested sub-navs.
- **Consistent layout**: Sidebar always visible on desktop. Top bar always shows workspace switcher and quick-add button.
- **One primary action per page**: Dashboard → "Add transaction". Budgets → "Set budget". Goals → "Create goal".
- **Progressive disclosure**: Lists show summary rows; click to expand or navigate to detail.
- **Supportive empty states**: Every section has a clear empty state explaining what it does and how to get started.

---

## 3. Information Architecture — Internal Admin Area

The admin area is a separate authenticated surface for internal use only. It is not visible to regular users. It should be functional and efficient, not beautiful.

### Admin navigation

```
Dashboard (overview)
Users
Waitlist
Subscriptions
Support
System
```

### Page inventory — Admin

| Page | Route | Purpose |
|------|-------|---------|
| **Admin Dashboard** | `/admin` | Key metrics: total users, active users, waitlist count, subscription breakdown, recent signups |
| **Users** | `/admin/users` | User list with search, filter by plan/status. Click into user detail |
| **User detail** | `/admin/users/[id]` | User profile, subscription status, workspace count, account count, support notes |
| **Waitlist** | `/admin/waitlist` | Waitlist entries with date, email, status (pending/invited/converted). Bulk invite action |
| **Subscriptions** | `/admin/subscriptions` | Subscription list: active, cancelled, expired. Revenue summary |
| **Support** | `/admin/support` | Support tickets or flagged users. Basic queue |
| **System** | `/admin/system` | Feature flags, maintenance mode toggle, basic health checks |

### Admin MVP scope (resolving Phase 1 open question)

The "as fully featured as practical" admin panel is now scoped to:

1. **Users**: List, search, view detail, disable/enable account
2. **Waitlist**: List, search, send invite (single + bulk), mark as converted
3. **Subscriptions**: List, view status, no direct billing modification (handled by Stripe dashboard)
4. **Support**: Basic notes per user, flag/unflag users
5. **System**: Feature flags (simple key-value toggles), maintenance mode
6. **Dashboard**: Aggregate counts and charts (users, signups over time, plan distribution)

This is sufficient for a solo founder to operate the product. More complex admin features (audit logs, advanced analytics, role-based admin access) are post-v1.

---

## 4. Proposed Route Structure (Next.js App Router)

Designed for Next.js App Router with route groups, layouts, and middleware-based auth guards.

```
app/
├── (marketing)/              # Public marketing site — no auth required
│   ├── layout.tsx            # Marketing layout: header + footer
│   ├── page.tsx              # Home `/`
│   ├── pricing/
│   │   └── page.tsx          # `/pricing`
│   ├── faq/
│   │   └── page.tsx          # `/faq`
│   ├── about/
│   │   └── page.tsx          # `/about`
│   ├── contact/
│   │   └── page.tsx          # `/contact`
│   ├── waitlist/
│   │   └── page.tsx          # `/waitlist`
│   └── legal/
│       ├── privacy/
│       │   └── page.tsx      # `/legal/privacy`
│       └── terms/
│           └── page.tsx      # `/legal/terms`
│
├── (auth)/                   # Auth pages — no sidebar, minimal layout
│   ├── layout.tsx            # Centered card layout
│   ├── login/
│   │   └── page.tsx          # `/login`
│   ├── signup/
│   │   └── page.tsx          # `/signup`
│   ├── forgot-password/
│   │   └── page.tsx          # `/forgot-password`
│   └── reset-password/
│       └── page.tsx          # `/reset-password`
│
├── app/                      # Authenticated app — requires auth middleware
│   ├── layout.tsx            # App shell: sidebar + top bar
│   ├── dashboard/
│   │   └── page.tsx          # `/app/dashboard`
│   ├── accounts/
│   │   ├── page.tsx          # `/app/accounts`
│   │   └── [id]/
│   │       └── page.tsx      # `/app/accounts/[id]`
│   ├── transactions/
│   │   └── page.tsx          # `/app/transactions`
│   ├── budgets/
│   │   └── page.tsx          # `/app/budgets`
│   ├── bills/
│   │   └── page.tsx          # `/app/bills`
│   ├── cashflow/
│   │   └── page.tsx          # `/app/cashflow`
│   ├── goals/
│   │   ├── page.tsx          # `/app/goals`
│   │   └── [id]/
│   │       └── page.tsx      # `/app/goals/[id]`
│   ├── income/
│   │   └── page.tsx          # `/app/income`
│   ├── analytics/
│   │   └── page.tsx          # `/app/analytics`
│   ├── debt/
│   │   └── page.tsx          # `/app/debt`
│   ├── onboarding/
│   │   └── page.tsx          # `/app/onboarding`
│   └── settings/
│       ├── page.tsx          # `/app/settings`
│       └── billing/
│           └── page.tsx      # `/app/settings/billing`
│
├── admin/                    # Admin area — requires admin auth middleware
│   ├── layout.tsx            # Admin shell: admin sidebar + top bar
│   ├── page.tsx              # `/admin` (dashboard)
│   ├── users/
│   │   ├── page.tsx          # `/admin/users`
│   │   └── [id]/
│   │       └── page.tsx      # `/admin/users/[id]`
│   ├── waitlist/
│   │   └── page.tsx          # `/admin/waitlist`
│   ├── subscriptions/
│   │   └── page.tsx          # `/admin/subscriptions`
│   ├── support/
│   │   └── page.tsx          # `/admin/support`
│   └── system/
│       └── page.tsx          # `/admin/system`
│
├── api/                      # API routes
│   └── ...                   # Defined in later phases
│
├── layout.tsx                # Root layout
└── middleware.ts             # Auth guards: redirect unauthenticated users, admin role check
```

### Layout hierarchy

1. **Root layout** — HTML shell, fonts, global providers (theme, auth context)
2. **Marketing layout** — Header with nav, footer. No sidebar.
3. **Auth layout** — Centred card, minimal chrome. Logo only.
4. **App layout** — Sidebar, top bar, workspace context. Auth-gated.
5. **Admin layout** — Admin sidebar, admin top bar. Admin-role-gated.

### Middleware strategy

- `/app/*` routes require authenticated session; redirect to `/login` if not
- `/admin/*` routes require authenticated session with admin role; redirect to `/login` or show 403
- `/login`, `/signup` redirect to `/app/dashboard` if already authenticated
- Marketing routes are always public

---

## 5. User Flows

### 5.1 Visitor → Waitlist

```
Landing page → Reads hero + feature highlights
  → Clicks "Join Waitlist" CTA (or scrolls to waitlist section)
  → Enters email address
  → Optional: checks interest areas (budgeting, cashflow, benefits tracking, etc.)
  → Submits
  → Sees confirmation: "You're on the list. We'll be in touch."
  → Receives confirmation email
```

**Notes**: Waitlist is the pre-launch path. Post-launch, this route may redirect to signup or be removed.

### 5.2 Visitor → Signup

```
Landing page (or Pricing page) → Clicks "Get Started" CTA
  → Signup page: email + password (or magic link)
  → Email verification sent
  → User verifies email
  → Redirected to `/app/onboarding`
```

**Notes**: Signup is minimal — email and password only. No name, no phone, no address. Name is captured in onboarding.

### 5.3 Signup → Onboarding

```
Post-signup → `/app/onboarding`
  Step 1: Welcome + "What should we call you?" (display name)
  Step 2: Workspace type — Personal or Personal + Household
  Step 3: Income setup — amount/range, pay frequency, next pay date
  Step 4: "Do you receive benefits income?" → Yes/No
    If Yes → Select benefit types: Universal Credit, PIP, Child Benefit, Carer's Allowance, ESA, Housing Benefit, Council Tax Reduction, Other (checkboxes, optional amounts and frequency per type)
  Step 5: "How would you like to start?" → Demo data / Blank workspace
  → Complete → Redirect to `/app/dashboard`
```

**Design notes**:
- Each step is a single focused screen with one question
- Progress indicator shows current step (e.g. "Step 2 of 5")
- "Skip" link visible on every step
- Back navigation available
- Steps are short enough to complete in under 2 minutes total

### 5.4 Skip Onboarding → Demo

```
Post-signup → `/app/onboarding`
  → User clicks "Skip setup" at any point
  → Modal: "Start with demo data so you can explore, or start fresh?"
    → [Explore with demo data]  →  Provisions demo workspace → Dashboard
    → [Start fresh]             →  Creates blank workspace → Dashboard (with empty states)
```

**Demo data includes**: 1 current account, 1 savings account, 1 credit card. ~30 sample transactions across 2 months. 5 recurring bills. 4 budget categories. 1 savings goal, 1 financial goal (debt payoff). 1 debt tracking entry. 2 income sources (employment + child benefit).

### 5.5 Create First Workspace

```
Onboarding Step 2 (or Settings → Workspace)
  → Select workspace type: Personal / Personal + Household
  → Workspace created with default categories and settings
  → User proceeds to next onboarding step (or dashboard if from settings)
```

**Notes**: In v1, users get 1 workspace on Free, multiple on Pro. Workspace type affects default categories (e.g. Household adds "Childcare", "School", "Groceries — household").

### 5.6 Add First Account

```
Dashboard (empty state) or Accounts page
  → Clicks "Add account" (prominent CTA in empty state)
  → Modal or inline form:
    - Account name (e.g. "Barclays Current")
    - Account type: Current / Savings / Credit Card / Cash / Investments
    - Current balance (£)
  → Save
  → Account appears in list
  → Dashboard updates to show balance
```

**Design notes**: This should take under 10 seconds. Three fields, one save. No bank details, no sort codes, no account numbers — manual-first means just a name, type, and balance.

### 5.7 Add First Transaction

```
Any page → Clicks "+ Transaction" (quick-add in top bar)
  → Slide-out panel or modal:
    - Amount (£)
    - Description / payee
    - Category (dropdown with defaults + custom)
    - Account (dropdown)
    - Date (defaults to today)
    - Type: Expense / Income (toggle, defaults to Expense)
  → Save
  → Transaction appears in list
  → Account balance updates
```

**Design notes**: Amount and description are the only truly required fields. Category, account, and date have sensible defaults. The form should feel fast — optimise for "I just spent £4.50 at Tesco" entry in 5 seconds.

### 5.8 Set Up Recurring Bills

```
Bills & Subscriptions page (empty state or "Add bill" button)
  → Clicks "Add bill"
  → Form:
    - Name (e.g. "Netflix", "Council Tax", "Electricity")
    - Amount (£)
    - Frequency: Monthly / Weekly / Fortnightly / Four-weekly / Annually
    - Next due date
    - Payment method: Direct debit / Standing order / Card / Manual
    - Account (which account it comes from)
    - Category (auto-suggested based on name)
  → Save
  → Bill appears in list with next due date
  → Bill appears on cashflow calendar
```

### 5.9 View Dashboard

```
User navigates to Dashboard (default landing after login)
  → Dashboard shows:
    - Total balance across all accounts (summary card)
    - Account balances (card per account)
    - Next pay date (e.g. "Pay day: 25th April — 3 days away")
    - Recent transactions (last 5–10)
    - Upcoming bills (next 7 days)
    - Budget status (this month — bar charts per category)
    - Goals progress (summary cards)
  → Each section links to its full page
  → Primary CTA: "+ Transaction"
```

**Design notes**: Dashboard is read-heavy, action-light. It answers "where am I financially right now?" at a glance. It should not be overwhelming — 4–6 cards maximum on initial load, with "see more" links.

### 5.10 Upgrade to Paid (Pro)

```
User hits a Pro-gated feature (e.g. tries to create a second workspace, or views Analytics)
  → Sees upgrade prompt: "This feature is available on Pro"
  → Clicks "Upgrade to Pro — £4.99/month"
  → Redirect to `/app/settings/billing`
  → Stripe Checkout or embedded payment form
  → Enters card details
  → Payment processed
  → Subscription active immediately
  → Redirect back to the feature they wanted
  → Pro badge appears in sidebar
```

**Alternative path**: User proactively goes to Settings → Billing → "Upgrade to Pro".

**Notes**: No annual plan in v1 — keep it simple. Monthly only. Cancel anytime from the same billing page.

### 5.11 Admin: Review Users, Waitlist, Subscriptions

```
Admin logs in → `/admin`
  → Dashboard shows: total users, new signups (7d), waitlist size, active subscriptions, MRR

Admin → Users
  → Searchable/filterable list: name, email, plan, signup date, last active
  → Click user → detail page: profile, subscription, workspaces, account count, support notes
  → Actions: disable account, add support note

Admin → Waitlist
  → List: email, date joined, interest areas, status (pending/invited/converted)
  → Actions: send invite (single), bulk invite (select multiple → send), export CSV

Admin → Subscriptions
  → List: user, plan, status (active/cancelled/expired), start date, next billing date
  → Summary: total active, MRR, churn count (30d)
  → No direct billing actions — link to Stripe dashboard for payment issues
```

### 5.12 Pay Date Tracking

Pay date tracking is a cross-cutting feature, not a standalone page. It surfaces in three places:

1. **Income page** (`/app/income`): Each income source has a frequency and a next pay date. Users set this during onboarding (step 3) or when adding/editing an income source. The system calculates future pay dates from the frequency and anchor date.

2. **Dashboard**: A "Next pay day" card shows the nearest upcoming pay date across all income sources (e.g. "Pay day: 25th April — 3 days away"). If the user has multiple income sources with different dates, show the next one.

3. **Cashflow calendar** (`/app/cashflow`): All income events (employment pay dates, benefits payment dates) are plotted on the calendar alongside bills and expenses, giving a complete view of money in and money out.

### 5.13 Financial Goals vs Savings Goals

Phase 1 lists both "savings goals" and "financial goal setting and tracking". These are handled on the same Goals page but are distinct types:

- **Savings goal**: Save toward a positive target amount. Examples: "Holiday fund — save £1,500", "Emergency fund — save £3,000". Progress is tracked by contributions.
- **Financial goal**: Achieve a financial outcome that is not purely saving. Examples: "Pay off credit card by December", "Reduce eating-out spending to under £50/month". Can be linked to a debt entry or a budget category.

Both types appear on `/app/goals`, with a type indicator. Creating a goal offers a choice: "Save toward something" or "Reach a financial target".

---

## 6. Pricing and Feature Gating

### Tier structure

| | **Free** | **Pro** — £4.99/month |
|---|---|---|
| **Accounts** | Up to 3 | Unlimited |
| **Transactions** | Unlimited | Unlimited |
| **Budgets** | Up to 5 categories | Unlimited categories |
| **Bills tracking** | Unlimited | Unlimited |
| **Savings goals** | Up to 2 | Unlimited |
| **Debt tracking** | Yes | Yes |
| **Income tracking** | Yes (all types incl. benefits) | Yes |
| **Cashflow calendar** | Yes | Yes |
| **Dashboard** | Yes | Yes |
| **Subscription tracking** | Yes | Yes |
| **Workspaces** | 1 | Up to 5 |
| **Analytics & trends** | Basic (spending by category) | Advanced (trends, net worth, forecasting) |
| **Cashflow forecasting** | — | Yes |
| **Net worth tracking** | — | Yes |
| **CSV import** | — | Yes |
| **CSV export** | Yes (basic) | Yes (full) |

### Gating philosophy

- **Free must be genuinely useful.** A user on the Free tier should be able to track their finances meaningfully — not feel locked out at every turn.
- **Pro unlocks scale and depth.** More accounts, more workspaces, advanced analytics, forecasting, and import/export.
- **Soft gates, not hard walls.** When a user hits a limit, show a friendly message explaining the Pro feature — not a blocking modal. Let them see what they are missing, not feel punished.
- **No feature teasing.** Do not show Pro features in the sidebar greyed out everywhere. Show a small "Pro" badge on Analytics; otherwise, keep the free experience clean.

### What triggers upgrade prompts

| Trigger | Message |
|---------|---------|
| Creating 4th account | "Free plans support up to 3 accounts. Upgrade to Pro for unlimited." |
| Creating 6th budget category | "Free plans support up to 5 budget categories. Upgrade to Pro for unlimited." |
| Creating 3rd savings goal | "Free plans support up to 2 savings goals. Upgrade to Pro for unlimited." |
| Creating 2nd workspace | "Multiple workspaces are a Pro feature." |
| Accessing Analytics (advanced) | "Advanced analytics, trends, and net worth tracking are Pro features." |
| Accessing Cashflow forecasting | "Cashflow forecasting is a Pro feature." |
| Attempting CSV import | "CSV import is a Pro feature." |

### Revenue model notes

- Payment via Stripe
- Monthly billing only in v1 (no annual plan yet — reduces complexity)
- Cancel anytime, access continues until end of billing period
- No refunds policy (standard SaaS)
- Free tier has no time limit — it is permanent

---

## 7. Workspace Model

### v1 workspace types

| Type | Description | Default categories | Availability |
|------|-------------|--------------------|--------------|
| **Personal** | Individual finance tracking | Standard personal categories (Groceries, Transport, Eating Out, Entertainment, Shopping, Health, Utilities, Rent/Mortgage, Other) | Free + Pro |
| **Personal + Household** | Combined personal and household tracking | Personal categories plus: Childcare, School, Groceries — Household, Home Maintenance, Family Activities | Free + Pro |

### Workspace rules

- Free users get 1 workspace
- Pro users get up to 5 workspaces
- Each workspace has its own accounts, transactions, budgets, goals, and bills
- Switching workspaces via the workspace switcher in the top bar
- Workspace type determines the default category set, but users can always add/edit/remove categories
- Workspaces are private to the user — no sharing in v1

### Post-v1 workspace expansion

- **Side Business** workspace type (with income/expense categories suited to self-employment)
- **Shared Household** — invite a partner, shared view, role-based access
- **Family** — multiple members, individual + shared budgets

These are deferred. The workspace model is designed to accommodate them later without restructuring — each workspace already has an owner, a type, and its own data scope.

---

## 8. Onboarding Strategy

### Principles

- **Progressive**: step-by-step, one question per screen
- **Skippable**: "Skip setup" always visible
- **Fast**: 5 steps, completable in under 2 minutes
- **Forgiving**: users can redo onboarding from settings later
- **Non-invasive**: ask only what is needed to set up a useful workspace

### Onboarding flow

| Step | Screen | Field(s) | Required? | Skip behaviour |
|------|--------|----------|-----------|----------------|
| 1 | Welcome | Display name | Encouraged | Defaults to "User" |
| 2 | Workspace | Workspace type: Personal / Personal + Household | Encouraged | Defaults to Personal |
| 3 | Income | Income amount or range (bracket selector), pay frequency, next pay date | Optional | Skips income setup; user can add later |
| 4 | Benefits | "Do you receive benefits income?" → If yes: select named UK types (UC, PIP, Child Benefit, Carer's Allowance, ESA, Housing Benefit, Council Tax Reduction, Other) with optional amounts and frequency | Optional | Skips benefits; user can add later |
| 5 | Start mode | Demo data / Blank workspace | Required (must choose one) | N/A — this step determines initial state |

### Post-onboarding state

After completing onboarding (or skipping to demo/blank):

- **Demo data path**: Workspace populated with sample accounts, transactions, bills, a budget, and a goal. Banner at top: "You're exploring demo data. You can clear it anytime from Settings."
- **Blank workspace path**: Dashboard shows supportive empty states. Primary CTA: "Add your first account".
- **Skipped onboarding**: User lands on the demo/blank choice (Step 5) and proceeds from there. No other data is pre-configured.

### Re-onboarding

Users can access a "Setup assistant" from Settings that replays the onboarding steps, allowing them to update display name, income, and benefits tracking preferences. This is not a full re-onboarding — it is the same screens, pre-filled with current values.

---

## 9. Demo Environment and Walkthrough Concept

### Purpose

The demo environment serves two audiences:
1. **New users who skipped onboarding** — gives them something to explore immediately
2. **Marketing site visitors** — the product preview on the landing page shows what the demo looks like

### Demo data specification

The demo workspace is pre-populated with realistic UK-centric data:

**Accounts (3)**:
- Barclays Current — £1,847.32
- Nationwide Savings — £3,200.00
- Tesco Credit Card — -£412.67

**Income sources (2)**:
- Employment: £2,400/month (25th of each month)
- Child Benefit: £96.00/four-weekly

**Transactions (~30)**: Spread across 2 months, realistic mix:
- Groceries (Tesco, Sainsbury's, Aldi)
- Transport (TfL, fuel)
- Bills (Council Tax, energy, water, broadband)
- Entertainment (Netflix, Spotify, cinema)
- Eating out (Nando's, Greggs, local pub)
- Health (pharmacy)
- Transfers between accounts

**Recurring bills (5)**:
- Rent — £950/month, 1st
- Council Tax — £145/month, 15th (10-month cycle)
- Energy — £85/month, direct debit, 3rd
- Broadband — £32/month, 12th
- Netflix — £10.99/month, 20th

**Budgets (4)**:
- Groceries — £300/month
- Eating Out — £80/month
- Transport — £100/month
- Entertainment — £50/month

**Debt tracking (1)**:
- Tesco Credit Card — balance £412.67, minimum payment £25/month, target payoff: 12 months

**Goals (2)**:
- Savings goal: "Holiday Fund" — target £1,500, saved £620
- Financial goal: "Pay off credit card" — linked to Tesco Credit Card debt, target £0 balance by March 2027

### Demo UX rules

- Demo data is clearly labelled: persistent banner "Exploring demo data" with a "Clear demo data" action
- Demo data is fully interactive — users can add, edit, delete demo transactions
- Clearing demo data wipes all demo content and leaves the workspace blank
- Demo data is never mixed with real data — if a user starts adding real transactions alongside demo data, the banner reminds them to clear when ready

### Product preview (marketing site)

The landing page includes a **static product preview** — not the live demo, but curated screenshots or an animated walkthrough showing:
1. The dashboard with account balances and budget progress
2. The quick-add transaction flow
3. The cashflow calendar with upcoming bills highlighted

This is a visual aid, not an interactive demo. It builds confidence before signup. Implementation: static images or a lightweight animated sequence (Lottie or CSS animation). Not an iframe of the actual app.

---

## 10. Landing Page Conversion Strategy and FAQ/Waitlist Positioning

### Landing page structure

The landing page follows a proven SaaS conversion structure, adapted for PerFi's calm, accessible brand:

| Section | Content | Purpose |
|---------|---------|---------|
| **Hero** | Headline + subheadline + CTA + product preview image | Capture attention, communicate value, show the product |
| **Problem statement** | "Managing money shouldn't feel this hard" — brief pain points | Empathy, resonance |
| **Solution** | 3–4 feature highlights with icons and one-line descriptions | Show what PerFi does |
| **Product preview** | Animated walkthrough or screenshot carousel | Visualise the experience |
| **Differentiators** | "Built for the UK", "Benefits-aware", "Designed for everyone" | Why PerFi, not alternatives |
| **Pricing teaser** | "Free to start. Pro for £4.99/month." + link to pricing page | Transparency, reduce friction |
| **Trust signals** | Accessibility commitment, data privacy messaging, "No bank connections needed" | Build confidence |
| **Final CTA** | "Ready to take control?" + signup/waitlist button | Convert |

### Conversion principles

1. **One primary CTA per section**: "Get Started" (or "Join Waitlist" pre-launch). Do not split attention with multiple competing actions.
2. **Reduce signup friction**: Email + password only. No credit card for free tier. No lengthy forms.
3. **Show the product early**: The product preview should appear above the fold or immediately after the hero. Users want to see what they are signing up for.
4. **Address the manual-first objection head-on**: "No bank sync? That's the point." — reframe manual entry as a feature of control and simplicity, not a limitation.
5. **Accessibility as a selling point, not a footnote**: Mention neurodiversity-conscious design prominently. This is a differentiator, not a compliance checkbox.

### FAQ positioning

FAQ is structured in groups to reduce cognitive load and help users find answers quickly:

**Product**
- What is PerFi?
- How is PerFi different from other budgeting apps?
- Do I need to connect my bank account?
- What account types can I track?
- Can I track benefits income?

**Pricing & Billing**
- Is PerFi free?
- What do I get on the free plan?
- What does Pro include?
- How do I upgrade or cancel?
- Is there a free trial of Pro?

**Data & Privacy**
- Where is my data stored?
- Do you sell my data?
- Can I export my data?
- Can I delete my account and all data?

**Accessibility**
- Is PerFi accessible?
- What accessibility standards does PerFi meet?
- Is PerFi designed for neurodivergent users?

### Waitlist positioning (pre-launch)

The waitlist serves as the primary conversion mechanism before the product launches:

- **Placement**: Prominent CTA on the landing page, dedicated `/waitlist` page
- **Capture**: Email address (required), interest areas (optional checkboxes: budgeting, cashflow, benefits tracking, debt tracking, goals)
- **Confirmation**: Immediate on-screen confirmation + confirmation email
- **Follow-up**: Periodic email updates on launch progress (managed manually or via simple email tool)
- **Conversion**: When ready to launch, waitlist subscribers receive early access invites via admin panel bulk-invite feature
- **Tone**: "We're building something different. Join the waitlist to be first in." — confident but not pushy

### Post-launch transition

Once the product is live:
- Waitlist page redirects to signup (or is replaced with a signup CTA)
- Waitlist admin section remains for managing any unconverted entries
- "Join waitlist" CTAs across the site switch to "Get Started"

---

*Document version: Phase 2 v1.0*
*Created: 2026-03-30*

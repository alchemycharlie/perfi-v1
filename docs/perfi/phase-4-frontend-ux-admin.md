# PerFi — Phase 4: Frontend Architecture, UX Principles, Landing Page, and Admin Experience

## 1. Next.js App Router Architecture

### Why App Router

App Router is the right choice for PerFi because:

- **Server Components by default**: Marketing pages are fully static/server-rendered. App pages load fast with server-fetched data and hydrate only interactive parts.
- **Route groups**: Clean separation of marketing, auth, app, and admin without URL pollution.
- **Layouts**: Shared chrome (sidebar, top bar, footer) is defined once per surface and persists across navigation.
- **Middleware**: Single middleware file handles all auth guards, redirects, and feature flags.
- **Streaming**: Dashboard can progressively load cards as data arrives — good for perceived performance.

### Rendering strategy per surface

| Surface                     | Strategy                                                   | Reason                                                                                                    |
| --------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Marketing (`(marketing)/*`) | Static (SSG) with `generateStaticParams` or static exports | SEO, fast load, no user-specific data                                                                     |
| Auth (`(auth)/*`)           | Server-rendered                                            | Minimal, no caching needed                                                                                |
| App (`app/*`)               | Server Components + Client Components where interactive    | Data fetched server-side via Supabase, interactive elements (forms, charts, modals) are Client Components |
| Admin (`admin/*`)           | Server Components                                          | Data fetched via service_role server-side. Minimal interactivity.                                         |

### Key architectural decisions

- **No client-side router state for data**: Use Server Components to fetch data. Pass data down as props to Client Components where interaction is needed.
- **Server Actions for mutations**: Use Next.js Server Actions for form submissions and data mutations (create transaction, update budget, etc.). No separate API route layer for most CRUD operations.
- **API routes only for webhooks and external integrations**: `/api/webhooks/stripe`, `/api/waitlist`, `/api/contact`. Not for internal app CRUD.
- **Parallel routes / intercepting routes**: Not needed in v1. Keep routing simple.

---

## 2. Unified Repo Structure

One repo. One Next.js project. No monorepo tools (Turborepo, Nx). No separate packages for marketing vs app.

```
perfi/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   ├── (auth)/               # Login, signup, password reset
│   ├── app/                  # Authenticated product
│   │   ├── layout.tsx        # App shell: sidebar + top bar
│   │   ├── dashboard/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── bills/
│   │   ├── cashflow/
│   │   ├── goals/
│   │   ├── debt/
│   │   ├── income/
│   │   ├── analytics/
│   │   ├── onboarding/
│   │   └── settings/
│   ├── admin/                # Internal admin area
│   ├── api/                  # Webhooks, public form endpoints
│   ├── layout.tsx            # Root layout
│   └── middleware.ts         # Auth guards, redirects
│
├── components/
│   ├── ui/                   # Primitives: Button, Input, Card, Modal, etc.
│   ├── marketing/            # Marketing-specific: Hero, FeatureCard, PricingTable
│   ├── app/                  # App-specific: TransactionRow, BudgetBar, AccountCard
│   ├── admin/                # Admin-specific: UserTable, WaitlistTable
│   └── shared/               # Cross-surface: Logo, ThemeProvider, ErrorBoundary
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Component Supabase client
│   │   ├── middleware.ts      # Middleware Supabase client
│   │   └── admin.ts          # service_role client (server only)
│   ├── stripe/
│   │   └── config.ts         # Stripe client + helpers
│   ├── utils/
│   │   ├── dates.ts          # Recurring date calculation, formatting
│   │   ├── currency.ts       # GBP formatting
│   │   └── entitlements.ts   # Plan limit checks
│   └── validations/
│       └── schemas.ts        # Zod schemas for all entities
│
├── styles/
│   └── globals.css           # Tailwind directives, CSS variables, base styles
│
├── public/
│   ├── images/               # Marketing images, product screenshots
│   └── fonts/                # Self-hosted fonts (if any)
│
├── supabase/
│   ├── migrations/           # SQL migrations
│   └── seed.sql              # Demo data seed
│
├── tailwind.config.ts
├── next.config.ts
├── middleware.ts              # Symlink or re-export from app/middleware.ts
├── .env.local                # Local environment variables
├── .env.example              # Template for environment variables
└── package.json
```

### Why no monorepo

- One product, one deployment target (Cloudflare Pages via `@cloudflare/next-on-pages` or Cloudflare Workers)
- Marketing, app, and admin share the same design system, Supabase client, and auth middleware
- Monorepo tooling adds configuration overhead with no benefit for a solo founder
- If the project grows to need separate deployments, extraction is straightforward later

---

## 3. Route Groups for Marketing, App, and Admin

Covered in Phase 2 section 4 and confirmed in Phase 3 section 9. Summary of layout behaviour:

| Route group   | Layout           | Chrome                                | Auth                  |
| ------------- | ---------------- | ------------------------------------- | --------------------- |
| `(marketing)` | Marketing layout | Header nav + footer                   | None                  |
| `(auth)`      | Auth layout      | Centred card, logo only               | Redirect if logged in |
| `app/`        | App layout       | Sidebar + top bar + workspace context | Required              |
| `admin/`      | Admin layout     | Admin sidebar + admin top bar         | Required + admin role |

### Layout composition

```
Root layout (globals.css, fonts, providers)
  ├── Marketing layout (header, footer)
  ├── Auth layout (centred card)
  ├── App layout (sidebar, top bar, workspace provider)
  └── Admin layout (admin sidebar, admin top bar)
```

Each layout is a `layout.tsx` in the route group directory. Layouts persist across navigation within their group — the sidebar does not remount when switching from Dashboard to Transactions.

---

## 4. Tailwind and Design System Direction

### Design tokens via CSS variables

Define the design system as CSS custom properties in `globals.css`, referenced by Tailwind config. This enables future dark mode support without rewriting component classes.

```css
:root {
  --color-bg-primary: 255 255 255; /* White */
  --color-bg-secondary: 248 248 248; /* Off-white */
  --color-bg-tertiary: 240 240 240; /* Light grey */
  --color-text-primary: 23 23 23; /* Near-black */
  --color-text-secondary: 100 100 100; /* Mid grey */
  --color-text-muted: 160 160 160; /* Light text */
  --color-accent: 56 120 100; /* Muted teal-green */
  --color-accent-hover: 45 100 82; /* Darker teal */
  --color-success: 34 139 84; /* Green */
  --color-warning: 200 140 30; /* Amber */
  --color-danger: 180 50 50; /* Muted red — not aggressive */
  --color-border: 230 230 230; /* Subtle borders */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

### Colour philosophy

- **No aggressive red/green for financial indicators.** Use muted tones with clear labels. A budget overspend is indicated by a warm amber bar with text "£32 over budget", not a flashing red number.
- **Accent colour is a muted organic teal-green.** Feels calm, modern, slightly futuristic. Not the standard fintech blue.
- **High contrast text.** Primary text on white exceeds WCAG AA (4.5:1 ratio minimum). All interactive elements meet AA for large and normal text.

### Typography

- **One typeface**: Use a clean, readable sans-serif. Recommend **Inter** (open source, excellent for UI, good number rendering for financial data). Self-host via `next/font/google` for performance.
- **Scale**: 14px base for app body. 16px for marketing. Headings scale from 18px (h3) to 36px (h1 marketing). Tabular numbers (`font-variant-numeric: tabular-nums`) for all financial figures — ensures columns align.
- **Line height**: 1.5 for body, 1.2 for headings. Generous for readability.

### Spacing and density

- **Generous whitespace.** The app should feel spacious, not cramped. Minimum 16px padding on cards. 24px gap between sections.
- **Consistent spacing scale.** Use Tailwind's default 4px grid: `p-4` (16px), `gap-6` (24px), `my-8` (32px).
- **Low density by default.** Transaction lists show 8–10 rows visible, not 25. Pagination or "load more" preferred over infinite scroll.

### Component library approach

- **Build on Radix UI primitives** for accessible, unstyled interactive components: Dialog, Dropdown, Tooltip, Toggle, Tabs, Select, Popover.
- **Style with Tailwind.** No heavy component library (no MUI, no Chakra). Tailwind + Radix gives full control with minimal bundle size.
- **shadcn/ui as a starting reference.** Use its patterns and copy/paste approach for initial components, then customise to PerFi's brand. Do not install shadcn as a dependency — copy the patterns, own the code.

### Brand alignment

| Brand reference | What to borrow                                                   | What to avoid                                      |
| --------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| **Notion**      | Clean typography, generous whitespace, flat UI with subtle depth | Over-complex nested UI, icon overload              |
| **Granola**     | Interactive homepage feel, organic warmth, modern polish         | Nothing specific to avoid                          |
| **Plum**        | Friendly finance tone, approachable savings UX                   | Chatbot gimmick, overly playful                    |
| **Hostinger**   | Bold CTAs, clean pricing tables, trust-building layout           | Aggressive upselling                               |
| **DixonBaxi**   | Slightly futuristic aesthetic, confident typography              | Too abstract or art-directed for a utility product |

---

## 5. Shared Component Strategy

### Component tiers

```
Tier 1: UI Primitives       (components/ui/)
  Button, Input, Textarea, Select, Checkbox, Radio, Toggle,
  Card, Modal (Dialog), Dropdown, Tooltip, Tabs, Badge, Spinner,
  EmptyState, ProgressBar, Avatar, Separator

Tier 2: Composed Components  (components/shared/)
  Logo, PageHeader, SectionHeader, StatCard, DataTable,
  FormField (label + input + error), CurrencyInput,
  ConfirmDialog, UpgradeBanner, ProBadge

Tier 3: Feature Components   (components/app/, components/marketing/, components/admin/)
  TransactionRow, TransactionForm, AccountCard, BudgetBar,
  BillRow, GoalCard, CashflowCalendar, IncomeSourceCard,
  DebtCard, DashboardWidget, OnboardingStep,
  Hero, FeatureSection, PricingTable, FAQAccordion,
  UserTable, WaitlistTable, AdminStatCard
```

### Key shared components

**CurrencyInput**: A specialised input that formats GBP values, enforces numeric entry, and displays the £ symbol. Used everywhere amounts are entered.

**EmptyState**: A consistent component for empty pages/sections. Props: `title`, `description`, `action` (optional CTA button), `illustration` (optional). Ensures no blank screens anywhere in the app.

**UpgradeBanner**: Soft inline banner shown when a user hits a plan limit. Props: `feature`, `message`. Not a blocking modal — appears inline where the action was attempted.

**DataTable**: A lightweight table component with sorting, optional pagination, and optional search. Used for transactions, bills, admin user lists. Keyboard navigable.

**FormField**: Wraps label, input, and validation error in a consistent pattern. Reduces boilerplate and ensures every form field has a visible label (accessibility requirement).

---

## 6. Data Fetching and Mutation Approach

### Server Components for reads

All data fetching happens in Server Components using the Supabase server client:

```
// app/app/transactions/page.tsx (Server Component)
export default async function TransactionsPage() {
  const supabase = createServerClient()
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(name, colour)')
    .order('date', { ascending: false })
    .limit(50)

  return <TransactionList transactions={transactions} />
}
```

**Benefits**: No loading spinners for initial page load. Data is fetched server-side and streamed to the client. RLS applies automatically because the server client reads the user's session from cookies.

### Server Actions for mutations

Mutations (create, update, delete) use Next.js Server Actions:

```
// lib/actions/transactions.ts
'use server'

export async function createTransaction(formData: FormData) {
  const supabase = createServerClient()
  // Validate with Zod
  // Insert into database
  // Revalidate the page
  revalidatePath('/app/transactions')
}
```

**Benefits**: No API route boilerplate. Type-safe. Progressive enhancement — forms work without JavaScript. Automatic revalidation refreshes server-fetched data.

### When to use API routes

Only for:

- `/api/webhooks/stripe` — Stripe webhook handler
- `/api/waitlist` — Public waitlist form submission (no auth)
- `/api/contact` — Public contact form submission (no auth)

These are endpoints called by external services or public forms that cannot use Server Actions (no authenticated session or no JS on the client for the marketing site forms).

### Client-side state

Minimal. Most state lives on the server (database) and is fetched per-request.

Client-side state is used for:

- **Active workspace ID**: React context, persisted to localStorage. Sent with every server action.
- **UI state**: Modal open/closed, form input values, sidebar collapsed state. Standard React state.
- **Optimistic updates**: When adding a transaction, show it in the list immediately before the server action completes. Use `useOptimistic` from React.

No global state management library (no Redux, no Zustand). Server Components + React context is sufficient for v1.

---

## 7. Forms Strategy

### Approach: Server Actions + Zod + progressive enhancement

Every form in PerFi follows the same pattern:

1. **Zod schema** defines the shape and validation rules
2. **Server Action** handles submission, validates server-side, writes to database
3. **Client-side validation** provides instant feedback using the same Zod schema
4. **FormField component** wraps every input with label, error display, and description

### Form patterns

**Quick-add transaction** (most frequent form in the app):

- Triggered from the `+ Transaction` button in the top bar
- Opens as a slide-out panel (not a full page — reduces context switching)
- Fields: Amount (CurrencyInput), Description, Category (Select), Account (Select), Date (defaults to today), Type (Expense/Income toggle)
- Amount and Description are required. Everything else has defaults.
- Submit closes the panel and shows a brief toast confirmation
- Optimistic update shows the transaction in the list immediately

**Full-page forms** (onboarding steps, settings):

- One question per screen (onboarding)
- Standard form layout with clear sections (settings)
- Submit button at the bottom, always visible
- Validation errors appear inline below each field

**Inline editing** (rename account, adjust budget amount):

- Click-to-edit pattern. The value becomes an input on click.
- Press Enter to save, Escape to cancel
- Server Action fires on save

### Validation rules

| Entity        | Key validations                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| Transaction   | Amount > 0, description required, valid account_id, valid category_id, date not in far future |
| Account       | Name required, type from enum, balance is numeric                                             |
| Budget        | Amount > 0, valid category_id, unique per category per workspace                              |
| Bill          | Name required, amount > 0, valid frequency, valid payment method, next_due_date required      |
| Goal          | Name required, target_amount > 0, valid type                                                  |
| Income source | Name required, amount > 0, valid frequency, valid type                                        |

### Error handling

- **Validation errors**: Inline, per-field. Red border + error message below the field.
- **Server errors**: Toast notification at the top of the screen. "Something went wrong. Please try again."
- **Network errors**: Forms retain their state. The user does not lose input. A retry prompt appears.

---

## 8. Charting and Visualisation Approach

### Library: Recharts

**Recharts** is the recommended charting library:

- Built on React + D3 — composable, customisable
- Good SSR support (renders SVG, not Canvas)
- Accessible: SVG elements can have ARIA labels
- Lightweight compared to Chart.js for React use
- Well-maintained, large community

### Charts needed for v1

| Location                             | Chart type                   | Data                                                  |
| ------------------------------------ | ---------------------------- | ----------------------------------------------------- |
| **Dashboard — Budget status**        | Horizontal bar chart         | Per-category: budget vs spent this month              |
| **Dashboard — Account balances**     | No chart — use StatCards     | Balance per account                                   |
| **Budgets page**                     | Progress bars (per category) | Budget limit vs spent, month selector                 |
| **Analytics — Spending by category** | Donut/pie chart              | Spending breakdown for selected period                |
| **Analytics — Spending over time**   | Line or area chart           | Monthly spending trend (3–6 months)                   |
| **Analytics — Income vs expenses**   | Stacked bar chart            | Monthly income vs expenses                            |
| **Goals — Progress**                 | Progress bar or ring         | Current amount vs target                              |
| **Debt — Payoff progress**           | Progress bar                 | Balance vs original amount                            |
| **Cashflow calendar**                | Custom calendar grid         | Not a chart — a date grid with income/expense markers |

### Visualisation principles

- **Muted colour palette.** Charts use the design system colours, not default chart library colours. Budget bars are teal when on track, warm amber when close to limit, muted red-brown when over.
- **No aggressive red/green.** Colour is supplemented by text labels. A budget bar that is over limit shows "£32 over" in text, not just a red bar.
- **Accessible colour choices.** All chart colours must be distinguishable in greyscale (for colour-blind users). Use patterns or labels in addition to colour where possible.
- **Tabular numbers in charts.** All axis labels, tooltips, and values use tabular-nums for alignment.
- **Tooltips on hover/focus.** Charts have keyboard-focusable data points with tooltip details.
- **No animation by default.** Charts render immediately. No spinning pie charts or growing bars. Respect `prefers-reduced-motion`.

### Cashflow calendar

The cashflow calendar is not a standard chart — it is a custom calendar grid component:

- Month view with day cells
- Each cell shows: income events (green dot), expense events (amber dot), bill due dates (outlined dot)
- Click a day to see detail: what is due, what is expected
- Current day highlighted
- Navigation: previous/next month arrows
- Shows projected balance at each day (running total from current balance + income − bills)
- Implementation: custom component, not a charting library. A CSS grid of 7 columns × 5–6 rows.

---

## 9. Neurodiversity-Aware UX Principles

These are concrete design rules, not abstract principles. Every page and component must follow them.

### 9.1 One primary action per screen

Every page has one clear thing the user can do. The primary action is visually prominent (filled button, contrasting colour). Secondary actions are text links or outlined buttons.

| Page         | Primary action                   |
| ------------ | -------------------------------- |
| Dashboard    | + Transaction                    |
| Accounts     | Add account                      |
| Transactions | + Transaction (or filter/search) |
| Budgets      | Set budget (or adjust)           |
| Bills        | Add bill                         |
| Goals        | Create goal                      |
| Debt         | Add debt                         |
| Income       | Add income source                |

### 9.2 Predictable layout

- Sidebar is always in the same position. It does not collapse unexpectedly.
- The top bar always shows the same elements: workspace switcher, quick-add, user menu.
- Page content always starts in the same place, below the top bar.
- No content shift after load. Skeleton screens maintain layout while data streams in.

### 9.3 Progressive disclosure

- Transaction lists show: date, description, amount, category. Click to expand: notes, account, edit/delete actions.
- Dashboard shows summary cards. "See all" links lead to full pages.
- Settings are grouped into sections. Each section can expand to reveal options.
- Onboarding shows one question at a time, not all at once.

### 9.4 Calm visual hierarchy

- Maximum 3 levels of visual emphasis on any screen: heading, body, muted.
- No more than 2 accent-coloured elements visible at once.
- No competing CTAs. If there are two possible actions, one is clearly primary and one is clearly secondary.
- Generous whitespace between sections. Cards have clear boundaries.

### 9.5 No surprise interactions

- No auto-playing animations.
- No content that moves without user action.
- Modals only open when the user clicks a button. No modals on timer or scroll.
- Confirmation before destructive actions (delete account, delete transaction). Simple "Delete?" confirmation, not a multi-step flow.
- Tooltips appear on hover AND on keyboard focus. They do not cover important content.

### 9.6 Clear feedback

- Every action has visible feedback: toast for saves, inline update for edits, skeleton for loading.
- Error messages are specific: "Amount must be greater than 0", not "Invalid input".
- Success messages are brief and disappear after 3 seconds. They do not require user action.

---

## 10. Accessibility Principles

### Standards

- **WCAG 2.1 AA** compliance minimum for all surfaces
- Tested with keyboard navigation, screen reader (VoiceOver / NVDA), and axe-core automated testing

### Concrete requirements

| Requirement               | Implementation                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard navigation**   | Every interactive element reachable via Tab. Focus ring visible on all focused elements. Custom components (dropdowns, modals) trap focus correctly.                                                                |
| **Screen reader support** | All images have alt text. All icons have aria-label or are aria-hidden if decorative. Form fields have associated labels (never placeholder-only). Landmarks: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`. |
| **Colour contrast**       | All text meets 4.5:1 contrast ratio against background. Large text (18px+) meets 3:1. Interactive elements meet 3:1 for non-text contrast.                                                                          |
| **Focus management**      | When a modal opens, focus moves to the modal. When it closes, focus returns to the trigger. Page transitions move focus to the main content area.                                                                   |
| **Reduced motion**        | Respect `prefers-reduced-motion`. No animations when this preference is set. Charts render instantly. Page transitions are instant.                                                                                 |
| **Semantic HTML**         | Use correct heading hierarchy (h1 → h2 → h3, no skipping). Use `<button>` for actions, `<a>` for navigation. Use `<table>` for tabular data (transaction lists, admin tables).                                      |
| **Error identification**  | Form errors are associated with their field via `aria-describedby`. Error text is visually distinct (colour + icon) and announced to screen readers.                                                                |
| **Skip links**            | "Skip to main content" link at the top of every page, visible on focus.                                                                                                                                             |
| **Touch targets**         | All interactive elements at least 44x44px on touch devices.                                                                                                                                                         |
| **Zoom**                  | Content is readable and functional at 200% browser zoom. No horizontal scrolling at 200%.                                                                                                                           |

### Testing strategy

1. **Automated**: Run axe-core on every page as part of CI. Fail the build on AA violations.
2. **Manual keyboard testing**: Tab through every page once before release. Verify focus order is logical.
3. **Screen reader spot-check**: Test key flows (add transaction, navigate dashboard, onboarding) with VoiceOver.
4. **Colour contrast**: Verify with browser DevTools contrast checker during design.

---

## 11. Dashboard UX Approach

### Purpose

The dashboard answers one question: **"Where am I financially right now?"**

It is read-heavy and action-light. The user should be able to glance at it and understand their financial position in under 5 seconds.

### Layout

Desktop: 2-column grid with a full-width top section.

```
┌──────────────────────────────────────────────┐
│  Total Balance: £4,634.65                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Barclays │ │ Savings  │ │ Credit   │     │
│  │ £1,847   │ │ £3,200   │ │ -£413    │     │
│  └──────────┘ └──────────┘ └──────────┘     │
├──────────────────────┬───────────────────────┤
│  Next pay day        │  Upcoming bills       │
│  25th Apr — 3 days   │  Energy — 3rd — £85   │
│                      │  Broadband — 12th     │
│                      │  Council Tax — 15th   │
├──────────────────────┼───────────────────────┤
│  Budget status       │  Goals progress       │
│  Groceries ████░ 73% │  Holiday Fund         │
│  Eating Out ██░░ 45% │  ████░░ £620 / £1,500 │
│  Transport ███░░ 62% │                       │
├──────────────────────┴───────────────────────┤
│  Recent transactions                         │
│  Today    Tesco     Groceries     -£34.50    │
│  Today    TfL       Transport      -£5.40    │
│  Yest.    Greggs    Eating Out     -£3.85    │
│  ...                                         │
│  [See all transactions →]                    │
└──────────────────────────────────────────────┘
```

### Cards

| Card                    | Data source                                          | Link             |
| ----------------------- | ---------------------------------------------------- | ---------------- |
| **Total balance**       | Sum of all `accounts.balance`                        | → Accounts       |
| **Account balances**    | Each active account                                  | → Account detail |
| **Next pay day**        | Nearest `income_sources.next_pay_date`               | → Income         |
| **Upcoming bills**      | `bills` where `next_due_date` within 7 days          | → Bills          |
| **Budget status**       | `budgets` with transaction sum for current month     | → Budgets        |
| **Goals progress**      | Active `goals` with `current_amount / target_amount` | → Goals          |
| **Recent transactions** | Last 5 `transactions` ordered by date                | → Transactions   |

### Responsive behaviour

- **Desktop (≥1024px)**: 2-column grid as shown above
- **Tablet (768–1023px)**: Single column, sidebar collapses to icons
- **Mobile (<768px)**: Single column, sidebar becomes bottom tab bar or hamburger. Cards stack vertically. Account balances scroll horizontally.

### Loading states

Each card loads independently using React Suspense with skeleton placeholders. The dashboard does not wait for all data before showing anything. Cards that resolve first appear immediately; others show pulsing skeleton shapes.

---

## 12. Empty States and Walkthrough Strategy

### Empty state design

Every section of the app has a thoughtful empty state. No blank pages, no "No data" text without context.

**Empty state component structure:**

```
┌─────────────────────────────────────┐
│         [Illustration/Icon]          │
│                                     │
│   [Title]                           │
│   [Description — what this is       │
│    and why it's useful]             │
│                                     │
│   [Primary action button]           │
└─────────────────────────────────────┘
```

### Empty states per page

| Page                        | Title                 | Description                                                                                       | Action            |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- | ----------------- |
| **Dashboard** (no accounts) | "Welcome to PerFi"    | "Add your first account to start tracking your finances."                                         | Add account       |
| **Accounts**                | "No accounts yet"     | "Accounts help you track your balances. Add a current account, savings, credit card, or cash."    | Add account       |
| **Transactions**            | "No transactions yet" | "Start logging your spending and income. It only takes a few seconds."                            | Add transaction   |
| **Budgets**                 | "No budgets set"      | "Budgets help you control spending by category. Set a monthly limit and see how you're tracking." | Set a budget      |
| **Bills**                   | "No bills tracked"    | "Track your recurring bills and subscriptions so you never miss a payment."                       | Add a bill        |
| **Cashflow**                | "Not enough data"     | "Add some accounts, income sources, and bills to see your cashflow calendar."                     | Add account       |
| **Goals**                   | "No goals yet"        | "Set a savings target or a financial goal to work toward."                                        | Create a goal     |
| **Debt**                    | "No debts tracked"    | "If you have credit cards, loans, or other debts, tracking them helps you plan payoff."           | Add a debt        |
| **Income**                  | "No income sources"   | "Add your employment income, benefits, or other income to see your full financial picture."       | Add income source |

### In-app walkthrough (guided tour)

Triggered when a user starts with demo data (Phase 2 section 9):

**Tour steps:**

| Step | Target                       | Message                                                                                          |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| 1    | Dashboard total balance card | "This is your dashboard. It shows your balances, upcoming bills, and budget status at a glance." |
| 2    | Quick-add button (top bar)   | "Tap here to add a transaction quickly from anywhere in the app."                                |
| 3    | Sidebar                      | "Use the sidebar to explore your accounts, budgets, cashflow, and more."                         |
| 4    | Cashflow in sidebar          | "Your cashflow calendar shows when money comes in and goes out."                                 |

**Implementation:**

- Lightweight tooltip overlay — a single `<div>` positioned next to the target element with a message and "Next" / "Got it" buttons.
- Render tour only when `preferences.has_seen_tour` is false.
- On completion or dismiss, update `profiles.preferences` via Server Action.
- Replayable from Settings → Help → "Replay tour".
- No third-party tour library needed — a simple component with 4 steps. Absolutely positioned tooltips with a semi-transparent backdrop highlighting the target element.

---

## 13. Landing Page Structure and Content Plan

### Page structure

The landing page is a long-scroll single page built from stacked sections. Each section is a Server Component (static rendering, zero JS unless interactive). The interactive product preview is a Client Component island embedded within the static page.

```
┌─────────────────────────────────────────┐
│  HEADER NAV                             │
│  Logo  Features  Pricing  FAQ  About    │
│  [Sign In]  [Get Started]              │
├─────────────────────────────────────────┤
│                                         │
│  HERO                                   │
│  "Your money. Your way."               │
│  Subheadline (2 lines)                 │
│  [Get Started — it's free]             │
│  Product preview image (dashboard)      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  PROBLEM STATEMENT                      │
│  "Managing money shouldn't feel         │
│   this hard."                           │
│  3 pain points as short paragraphs      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  FEATURE HIGHLIGHTS (3–4 cards)         │
│  Manual tracking  |  Budgets & Goals    │
│  Cashflow clarity |  Benefits-aware     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  INTERACTIVE PRODUCT PREVIEW            │
│  (Granola-style scrolling showcase)     │
│  See section 14 for details             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DIFFERENTIATORS                        │
│  "Built for the UK"                     │
│  "Designed for everyone"                │
│  "No bank sync needed"                  │
│  3 columns with icons + short copy      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  PRICING                                │
│  Free vs Pro comparison table           │
│  "Free to start. Pro for £4.99/month."  │
│  [Get Started — it's free]              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  TRUST / ACCESSIBILITY SECTION          │
│  "Built with accessibility at its       │
│   core."                                │
│  WCAG 2.1 AA  |  ND-conscious UX       │
│  Your data, your control | No tracking  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  FAQ (accordion, grouped)               │
│  Product | Pricing | Data | Access.     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  WAITLIST / FINAL CTA                   │
│  "Ready to take control?"              │
│  Email capture field                    │
│  [Join the waitlist] or [Get Started]   │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  Logo  Links  Legal  © 2026             │
└─────────────────────────────────────────┘
```

### Section-by-section content plan

**Hero**

- Headline: "Your money. Your way." (from Phase 1 positioning)
- Subheadline: "A calm, accessible personal finance tool built for the UK. Track your income — including benefits — manage budgets, and see your cashflow clearly. No bank sync needed."
- CTA: "Get Started — it's free" (primary, filled button)
- Visual: Product screenshot or stylised dashboard render showing account balances, a budget bar, and upcoming bills. Should feel real, not a generic mockup.

**Problem statement**

- Lead: "Managing money shouldn't feel this hard."
- Pain points (3 short paragraphs):
  1. "Most finance apps want to connect to your bank. But what if you'd rather stay in control?"
  2. "Spreadsheets work, but they don't show you when bills are due or whether you're on track."
  3. "And if you're neurodivergent, cluttered dashboards make financial admin even harder."

**Feature highlights**

- 4 cards in a grid:
  1. **Track everything manually** — "Add accounts, log transactions, and see your balances. No bank sync, no fuss."
  2. **Budgets and goals** — "Set spending limits by category. Save toward what matters."
  3. **Cashflow calendar** — "See when money comes in and goes out. Know exactly where you stand."
  4. **Benefits-aware** — "Universal Credit, PIP, Child Benefit — tracked with the same dignity as a salary."

**Differentiators** (3 columns)

1. **Built for the UK** — "GBP. Direct debits. Pay dates. Council tax. Designed around how money actually works here."
2. **Designed for everyone** — "Calm, clear, and accessible by default. Built with neurodivergent users in mind."
3. **No bank connections** — "You control your data. No Open Banking, no API sync, no anxiety."

**Pricing**

- Two-column comparison: Free vs Pro £4.99/month (from Phase 2 section 6)
- Below the table: "Start free. Upgrade when you need more."
- CTA: "Get Started — it's free"

**Trust / accessibility section**

- Headline: "Built with accessibility at its core."
- 4 trust points in a grid:
  1. "WCAG 2.1 AA compliant" — "Tested with screen readers and keyboard navigation."
  2. "Neurodiversity-conscious design" — "Low cognitive load, predictable layout, progressive disclosure."
  3. "Your data stays yours" — "We don't sell your data. No third-party analytics. No tracking cookies."
  4. "Delete anytime" — "Your data is fully deletable. No dark patterns, no lock-in."

**FAQ**

- Accordion component grouped by topic (Phase 2 section 10 has the question list)
- Default: all collapsed. Click to expand one at a time.

**Waitlist / final CTA**

- Pre-launch: "Join the waitlist" with email input + optional interest checkboxes
- Post-launch: "Get Started — it's free" with signup button

---

## 14. Interactive Preview Ideas for the Homepage

### Concept: Granola-style scrolling product showcase

Inspired by Granola's homepage where the product UI animates and transforms as the user scrolls. The preview feels like a window into the real product, not a static screenshot.

### Implementation approach

A fixed-position or sticky product preview frame in the centre of the viewport. As the user scrolls through the feature section, the preview transitions between different product views:

**Scroll sequence:**

| Scroll position               | Preview shows                                                | Feature text alongside           |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------- |
| Feature 1 — Manual tracking   | Dashboard with account balance cards and recent transactions | "Track everything manually" copy |
| Feature 2 — Budgets and goals | Budget progress bars and a goal card                         | "Budgets and goals" copy         |
| Feature 3 — Cashflow calendar | Calendar view with income/expense markers                    | "Cashflow calendar" copy         |
| Feature 4 — Benefits-aware    | Income page showing employment + benefits side by side       | "Benefits-aware" copy            |

### Technical implementation

- **Not a video.** Each "frame" is a designed static image or a lightweight React component rendering fake UI.
- **Scroll-triggered transitions.** Use CSS `position: sticky` on the preview container. Swap the visible frame based on scroll position using Intersection Observer.
- **Smooth crossfade.** Frames transition with a simple opacity crossfade (200ms). No sliding, no zooming, no bouncing.
- **Respects reduced motion.** If `prefers-reduced-motion` is active, show all frames stacked vertically as static images instead of the scroll-triggered animation.
- **Mobile fallback.** On screens below 768px, the sticky scroll effect is replaced with a simple stacked layout: each feature card has its own image below the text. No scroll animation on mobile.
- **Performance.** Images are optimised WebP or SVG. No heavy JS library. The scroll observer is a few lines of vanilla JS or a tiny hook. Total JS for this section: under 2KB.

### Alternative (simpler, if scroll animation is too complex for v1)

A tabbed or segmented control preview:

```
[Dashboard]  [Budgets]  [Cashflow]  [Income]
┌──────────────────────────────────────┐
│   (Product screenshot for selected   │
│    tab — crossfades on switch)       │
└──────────────────────────────────────┘
```

Click a tab, the screenshot changes. No scroll dependency. Still interactive, still builds confidence. Can be upgraded to the scroll-based version later.

**Recommendation**: Start with the tabbed approach for v1. It is simpler to implement, works well on all devices, and can be enhanced to the scroll-based version post-launch.

---

## 15. Admin Panel UX Priorities

### Design philosophy

The admin panel is a **functional tool**, not a showcase. It prioritises information density and efficiency over visual polish. It reuses the app's component library (DataTable, Card, StatCard, Button) but with a denser layout.

### Admin layout

```
┌──────┬────────────────────────────────────┐
│ SIDE │  ADMIN TOP BAR                     │
│ BAR  │  [PerFi Admin]          [User ▾]  │
│      ├────────────────────────────────────┤
│ Dash │                                    │
│ Users│  PAGE CONTENT                      │
│ Wait │                                    │
│ Subs │                                    │
│ Supp │                                    │
│ Sys  │                                    │
│      │                                    │
└──────┴────────────────────────────────────┘
```

### Page-by-page admin UX

**Admin Dashboard**

- 4 StatCards at top: Total users, Active (30d), Waitlist size, MRR
- Line chart: Signups over time (last 30 days)
- Pie chart: Plan distribution (Free vs Pro)
- Recent signups list (last 10)

**Users**

- DataTable: name, email, plan, status (active/disabled), signup date, last active
- Search by name or email
- Filter by plan (Free/Pro), status (active/disabled)
- Click row → user detail page
- User detail: profile info, subscription status, workspace count, account count, admin notes. Actions: disable/enable, add note.

**Waitlist**

- DataTable: email, date joined, interests, status (pending/invited/converted)
- Search by email
- Filter by status
- Actions: Select rows → "Send invite" (bulk). Individual "Send invite" button.
- "Export CSV" button (downloads all waitlist entries)

**Subscriptions**

- DataTable: user email, plan, status (active/cancelled/past_due/expired), start date, next billing
- Summary row: Total active, MRR (active Pro × £4.99), Churned (30d)
- No direct billing actions — link to Stripe Dashboard for payment issues

**Support**

- List of users with admin notes, ordered by most recent note
- Click to view user detail + notes history
- "Add note" form: simple textarea + save

**System**

- Feature flags: table of key-value pairs with toggle switches
- Maintenance mode: prominent toggle at top
- No complex configuration — just on/off flags

### Admin UX principles

1. **Dense but scannable.** More rows visible than the user-facing app. Smaller font sizes (13px). Compact padding.
2. **Search and filter first.** Every list has search. Filters are visible, not hidden in a dropdown.
3. **Bulk actions where useful.** Waitlist invites can be bulk-sent. User management is individual (too risky for bulk).
4. **No destructive actions without confirmation.** Disabling a user requires a confirmation dialog.
5. **Link to Stripe for billing.** Do not build billing management in the admin. Stripe Dashboard is better.

---

## 16. Email Capture and Contact Form Integration Approach

### Waitlist form (marketing site)

**Location**: Dedicated `/waitlist` page + embedded section at the bottom of the landing page.

**Fields**:

- Email (required)
- Interest areas (optional checkboxes): Budgeting, Cashflow, Benefits tracking, Debt tracking, Goals

**Submission flow**:

1. Client-side validation (valid email format)
2. POST to `/api/waitlist` (public API route, no auth required)
3. Server validates with Zod, checks for duplicate email
4. Insert into `waitlist_entries` table via service_role client
5. Return success response
6. Client shows confirmation: "You're on the list. We'll be in touch."

**Anti-spam**: Rate limiting on the `/api/waitlist` endpoint (Cloudflare rate limiting or simple in-memory rate limiter). Honeypot field (hidden field that bots fill but humans don't). No CAPTCHA in v1 — add only if spam becomes a problem.

**Email confirmation**: Optional. In v1, no confirmation email is sent automatically. The admin can send invites later from the admin panel. If email confirmation is wanted, integrate with a transactional email service (Resend or Supabase Auth emails) post-v1.

### Contact form (marketing site)

**Location**: `/contact` page.

**Fields**:

- Name (required)
- Email (required)
- Message (required, textarea)

**Submission flow**:

1. Client-side validation
2. POST to `/api/contact` (public API route)
3. Server validates with Zod
4. Insert into `contact_submissions` table via service_role
5. Return success response
6. Client shows confirmation: "Thanks for reaching out. We'll get back to you."

**Admin notification**: For v1, the admin checks the Support section of the admin panel for new submissions. No email notification to the admin on submission. If this becomes a problem, add a webhook or email notification to Resend post-v1.

### Transactional emails (auth)

Supabase Auth handles transactional emails:

- **Signup confirmation**: "Verify your email" — sent by Supabase Auth
- **Password reset**: "Reset your password" — sent by Supabase Auth
- **Magic link**: "Sign in to PerFi" — sent by Supabase Auth

**Customisation**: Use Supabase's email template customisation to brand these emails with the PerFi logo, colours, and tone. Keep them minimal — one purpose per email, one CTA.

### Waitlist invite emails (admin)

When the admin sends invites from the admin panel:

- Option 1: **Manual.** Admin copies the email address and sends an invite manually from their email client. Simplest for v1.
- Option 2: **Resend integration.** Admin clicks "Send invite", which calls an API route that sends a branded email via Resend with a signup link. Better UX but adds a dependency.

**Recommendation for v1**: Start with manual invite emails. Add Resend integration as a fast-follow if the waitlist grows beyond 50 entries and manual emailing becomes painful.

---

## 17. Supplementary Sections (Gap Fixes from Cross-Phase Audit)

The following sections were added after auditing Phase 4 against Phases 1–3 to close identified gaps.

### 17.1 CSV Export UX

Phase 1 lists CSV export as a v1 feature. Phase 2 defines the tier split (Free: transactions only, Pro: all data).

**Location**: Settings → Export Data (a section within the Settings page, not a separate page).

**UX**:

- Heading: "Export your data"
- Description: "Download your financial data as a CSV file."
- For Free users: single button "Export transactions" — downloads a CSV of all transactions in the active workspace.
- For Pro users: dropdown with options: "Transactions", "Accounts", "Budgets", "Bills", "Goals", "Income sources", "All data" (combined). Each downloads the corresponding CSV.
- Free users see a small note: "Upgrade to Pro to export all data types."
- Export triggers a Server Action that queries the database and returns a CSV file via a streamed response.
- No background job needed — CSV generation is fast for v1 data volumes.

### 17.2 Undo Support

Phase 1 section 9 specifies "Undo support where possible." Phase 4 section 9.5 covered confirmation for destructive actions but did not address undo.

**Approach**: Toast-based undo for single-item deletions.

- When a user deletes a transaction, bill, goal, or other single entity, the item is removed from the UI immediately (optimistic update).
- A toast appears at the bottom: "Transaction deleted. [Undo]"
- Toast stays for 5 seconds. If "Undo" is clicked, the delete Server Action is reversed (re-insert the item).
- If the toast expires, the delete is permanent.
- Implementation: the delete Server Action soft-holds the deletion for 5 seconds using a client-side timer. The actual database DELETE fires after the undo window closes, or fires immediately and the undo re-inserts.
- **Simpler v1 approach**: Delete immediately, store the deleted item in client-side state for 5 seconds. Undo re-inserts via a create Server Action. This avoids complex server-side hold logic.
- Undo is only for single-item deletions. Bulk actions (e.g. clear demo data) use confirmation dialogs without undo.

### 17.3 Onboarding Flow UX

Phase 2 section 8 defines a 5-step onboarding flow. This section provides the UX specification.

**Layout**: Each step is a centred card (same layout as auth pages). Progress indicator at top: "Step 2 of 5" with a thin progress bar.

**Step-by-step UX**:

| Step          | Screen                            | UX detail                                                                                                                                                                                                                                                                                                                     |
| ------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Welcome    | "What should we call you?"        | Single text input for display name. Pre-focused. Placeholder: "Your name". Below: "Skip" link (defaults to "User"). Primary CTA: "Continue".                                                                                                                                                                                  |
| 2. Workspace  | "How will you use PerFi?"         | Two large selectable cards: "Personal" (icon: single person, description: "Track your own finances") and "Personal + Household" (icon: house, description: "Track personal and household spending together"). Click to select, then "Continue". Skip defaults to Personal.                                                    |
| 3. Income     | "What's your main income?"        | Amount: CurrencyInput with bracket selector (e.g. "£0–£1,000", "£1,000–£2,000", "£2,000–£3,000", "£3,000+", or exact amount toggle). Pay frequency: segmented control (Weekly / Fortnightly / Four-weekly / Monthly). Next pay date: date picker defaulting to next occurrence. All optional. "Skip" link skips income setup. |
| 4. Benefits   | "Do you receive benefits income?" | Yes/No toggle. If Yes: checkboxes for UC, PIP, Child Benefit, Carer's Allowance, ESA, Housing Benefit, Council Tax Reduction, Other. Optional amount and frequency per selected type. All optional. "Skip" link skips benefits.                                                                                               |
| 5. Start mode | "How would you like to start?"    | Two large selectable cards: "Explore with demo data" (description: "See PerFi in action with sample data. You can clear it anytime.") and "Start fresh" (description: "Begin with a blank workspace and add your own data."). Must choose one — no skip.                                                                      |

**Transitions**: Cards slide left-to-right between steps (or instant if `prefers-reduced-motion`). Back arrow in top-left to go to previous step.

### 17.4 Workspace Switcher and User Menu UX

**Workspace switcher** (top bar, left side):

- Shows the active workspace name as a dropdown trigger (e.g. "My Finances ▾")
- Click opens a dropdown listing all workspaces the user is a member of
- Each item shows workspace name and type badge (Personal / Household)
- Click a workspace to switch — sets the active workspace in React context and localStorage, revalidates the current page
- At the bottom of the dropdown: "+ Create workspace" (if under plan limit) or "Upgrade to create more" (if at limit)
- Free users see only 1 workspace. Pro users see up to 5.

**User avatar menu** (top bar, right side):

- Shows the user's avatar (initials on a coloured circle) or display name
- Click opens a dropdown:
  - **Settings** → `/app/settings`
  - **Billing** → `/app/settings/billing`
  - **Help** → Opens a simple help panel or links to FAQ
  - Separator
  - **Sign out** → Signs out via Supabase Auth, redirects to `/login`

### 17.5 Settings and Billing Pages UX

**Settings page** (`/app/settings`):

Sections, each expandable or visible as a vertical stack:

| Section         | Fields                                                                                  | Actions                                           |
| --------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Profile**     | Display name (editable inline), email (read-only, with "Change email" link)             | Save                                              |
| **Workspace**   | Active workspace name (editable), type (read-only), default categories (manage list)    | Save                                              |
| **Preferences** | Reduce motion toggle, date format preference                                            | Save                                              |
| **Export**      | Export data section (see 17.1)                                                          | Export buttons                                    |
| **Tour**        | "Replay the PerFi tour" link                                                            | Resets `has_seen_tour` and redirects to dashboard |
| **Danger zone** | "Delete my account" — red text, requires confirmation dialog ("Type DELETE to confirm") | Delete                                            |

**Billing page** (`/app/settings/billing`):

| State                     | Display                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free plan**             | "You're on the Free plan." Feature comparison card showing what Pro unlocks. CTA: "Upgrade to Pro — £4.99/month" → Opens Stripe Checkout.                               |
| **Pro plan (active)**     | "You're on Pro. Next billing date: [date]." Payment method summary (last 4 digits). Actions: "Manage payment method" (→ Stripe Customer Portal), "Cancel subscription". |
| **Pro plan (cancelling)** | "Your Pro plan ends on [date]. You'll keep access until then." CTA: "Resume subscription" (→ reactivates via Stripe).                                                   |
| **Pro plan (past due)**   | "Your payment failed. Please update your payment method." CTA: "Update payment" (→ Stripe Customer Portal).                                                             |

### 17.6 Financial Goals vs Savings Goals — UX Distinction

The Goals page (`/app/goals`) shows both types with clear visual distinction:

**Goal creation flow**:

- Click "Create goal" → modal or form with type selector:
  - **"Save toward something"** (savings goal) — fields: Name, Target amount, Target date (optional)
  - **"Reach a financial target"** (financial goal) — fields: Name, Target description, Link to debt (optional dropdown), Link to budget category (optional dropdown), Target date (optional)

**Goals list**:

- Each goal card shows a type badge: "Savings" (teal) or "Financial" (amber)
- Savings goals show a progress bar: £620 / £1,500 (41%)
- Financial goals show progress differently depending on link:
  - Linked to debt: shows debt balance decreasing toward £0
  - Linked to budget category: shows current month spending vs target
  - Unlinked: shows manual progress updates

### 17.7 Cashflow Calendar — Detailed UX

**Layout**: Month view, 7-column CSS grid (Mon–Sun), 5–6 rows.

**Day cells**:

- Date number in top-left
- Coloured dots for events:
  - Income (teal dot) — pay dates from `income_sources`
  - Bills (amber dot) — due dates from `bills`
  - Manual transactions on that date (grey dot, if past)
- Click a day → expands an inline detail panel below the calendar row showing all events for that day:
  - "Salary — £2,400 (income)"
  - "Council Tax — £145 (direct debit)"
  - Running balance after that day: "Projected balance: £1,342"

**Navigation**: ← Previous month | "March 2026" | Next month →. "Today" button snaps to current month.

**Projected balance line**: Below the calendar grid, a simple horizontal sparkline showing projected balance across the month — rising on income days, falling on bill/expense days. This is a lightweight visualisation, not a full chart.

**Responsive**:

- Desktop: full month grid
- Mobile: list view — days stacked vertically, showing only days with events. "Show all days" toggle.

**Empty state**: "Not enough data yet. Add some accounts, income sources, and bills to see your cashflow calendar." (from section 12)

### 17.8 Auth Implementation Reference

Phase 4 defers to Phase 3 section 8 for auth implementation details. For clarity, the key points are:

- **Session handling**: `@supabase/ssr` package. JWT stored in httpOnly cookie, not localStorage. Refresh tokens rotated automatically.
- **Signup triggers**: Postgres triggers on `auth.users` insert create `profiles` (with `role = 'user'`, `onboarding_completed = false`) and `subscriptions` (with `plan = 'free'`, `status = 'active'`). No workspace created until onboarding step 2.
- **Email verification**: Required before first login. Supabase Auth sends verification email automatically.
- **Magic link**: Available as alternative login method. Supabase Auth handles the flow.
- **Middleware checks**: Session validation, `profiles.is_disabled` check (block disabled users), `profiles.onboarding_completed` check (redirect to `/app/onboarding` if false and not already there), `profiles.role` check for `/admin/*` routes.

### 17.9 Stripe Integration Reference

Phase 4 defers to Phase 3 section 14 for Stripe implementation details. For clarity, the key frontend touchpoints are:

**Upgrade flow**:

1. User clicks "Upgrade to Pro" (from UpgradeBanner, billing page, or pricing)
2. Server Action creates a Stripe Checkout Session with the user's email and the Pro price ID
3. User is redirected to Stripe Checkout (hosted by Stripe, not embedded)
4. On success, Stripe sends `checkout.session.completed` webhook → `/api/webhooks/stripe`
5. Webhook handler (using `service_role`) updates `subscriptions` table: sets `plan = 'pro'`, `status = 'active'`, stores Stripe IDs
6. User is redirected back to PerFi with updated subscription

**Cancel flow**:

1. User clicks "Cancel subscription" on billing page
2. Server Action calls Stripe API to set `cancel_at_period_end = true`
3. Stripe sends `customer.subscription.updated` webhook
4. Webhook handler updates `subscriptions.cancel_at_period_end = true`
5. UI shows "Your Pro plan ends on [date]"

**Webhook handler** (`/api/webhooks/stripe`):

- Verifies Stripe signature using webhook signing secret
- Handles events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.paid`
- All updates via `service_role` client
- Idempotent — safe to retry

### 17.10 Entitlement Enforcement Map

Maps Phase 3 entitlement rules to specific UI enforcement points:

| Plan limit                          | Where enforced                                        | UX behaviour                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Accounts ≤ 3** (Free)             | Account creation form / "Add account" action          | Check count before showing form. If at limit, show UpgradeBanner inline instead of form.                                              |
| **Budgets ≤ 5** (Free)              | Budget creation / "Set budget" action                 | Same pattern — inline UpgradeBanner.                                                                                                  |
| **Goals ≤ 2** (Free)                | Goal creation / "Create goal" action                  | Same pattern.                                                                                                                         |
| **Workspaces ≤ 1** (Free)           | Workspace switcher "Create workspace"                 | Greyed out with tooltip: "Upgrade to Pro for multiple workspaces."                                                                    |
| **Advanced analytics** (Pro only)   | Analytics page                                        | Free users see basic spending-by-category chart. Below it: UpgradeBanner with "Unlock trends, net worth tracking, and more with Pro." |
| **Cashflow forecasting** (Pro only) | Cashflow page, below the calendar                     | Free users see the calendar with current/past data. Forecasting section shows UpgradeBanner.                                          |
| **Net worth tracking** (Pro only)   | Analytics page, net worth section                     | Section shows UpgradeBanner for Free users.                                                                                           |
| **CSV import** (Pro only)           | Settings → Import section (not built in v1 but gated) | If accessed, show UpgradeBanner.                                                                                                      |
| **CSV export (full)** (Pro only)    | Settings → Export section                             | Free users see "Export transactions" only. Other options show Pro badge + UpgradeBanner.                                              |

All enforcement happens **both server-side** (Server Actions check `subscriptions.plan` before executing) **and client-side** (UI shows/hides based on plan from session context). Server-side is authoritative.

---

### 17.11 Mobile Navigation — Decision

Phase 4 section 11 left this as "bottom tab bar or hamburger". Decision:

**Bottom tab bar on mobile (<768px).**

Rationale:

- Bottom tabs are more accessible — thumb-reachable, always visible, predictable.
- Hamburger menus hide navigation and add cognitive load (against ND principles).
- PerFi has 10 sidebar items — too many for a tab bar. Solution: show the 5 most-used as tabs, with a "More" tab for the rest.

**Mobile tab bar:**

```
[Dashboard]  [Transactions]  [Budgets]  [Cashflow]  [More ···]
```

"More" opens a slide-up panel with: Accounts, Bills, Goals, Debt, Income, Analytics.

On tablet (768–1023px): sidebar collapses to icon-only rail (icons visible, labels hidden). Hover or focus shows label tooltip.

### 17.12 Error Pages and Global Error Handling

**404 — Not Found** (`app/not-found.tsx`):

- Friendly message: "Page not found. It may have been moved or doesn't exist."
- Link: "Go to Dashboard" (if authenticated) or "Go to Home" (if not).
- Same layout as the surface the user was in (marketing layout for public pages, app layout for app pages).

**500 — Server Error** (`app/error.tsx` and `app/global-error.tsx`):

- Message: "Something went wrong. We're looking into it."
- "Try again" button (calls `reset()` to retry the failed component).
- No technical details shown to the user.

**Disabled account** (redirect target from middleware):

- Route: `/disabled` (simple static page, no auth layout)
- Message: "Your account has been disabled. Please contact support."
- Link to contact page.

**Offline / network error**:

- Not a dedicated page. Forms retain state (section 7). Failed fetches show an inline retry prompt within the component that failed.

### 17.13 Loading State Pattern (Global)

Dashboard uses Suspense with per-card skeletons (section 11). The same pattern applies everywhere:

**Pattern**: Every page that fetches data uses a `loading.tsx` file in its route directory (Next.js convention). This shows a skeleton that matches the page layout.

**Skeleton rules**:

- Skeletons match the shape of the content they replace (rectangles for text, circles for avatars, bars for charts).
- Animate with a subtle pulse (`animate-pulse` in Tailwind). Respect `prefers-reduced-motion` — show static grey blocks instead.
- Never show a full-page spinner. Always show the page chrome (sidebar, top bar) immediately and skeleton the content area.

**Per-page skeletons**:
| Page | Skeleton |
|------|----------|
| Dashboard | 7 card skeletons in grid layout |
| Transactions | Table with 8 shimmer rows |
| Accounts | 3–5 card skeletons |
| Budgets | 5 progress bar skeletons |
| Bills | Table with 5 shimmer rows |
| Cashflow | Calendar grid skeleton (grey boxes) |
| Goals | 2 card skeletons |
| Debt | 2 card skeletons |
| Income | 3 card skeletons |
| Analytics | Chart skeleton (grey rectangle) + stat cards |

### 17.14 Category Management UX

Phase 3 has a `categories` table. Phase 2 says users can add, edit, reorder, and delete custom categories. Category management is accessed from **two places**:

**1. Settings → Workspace → Manage categories**

A dedicated section showing all categories for the active workspace:

```
┌──────────────────────────────────────────┐
│  Categories                  [+ Add]     │
│                                          │
│  EXPENSE                                 │
│  ☰ 🟢 Groceries              [Edit] [×] │
│  ☰ 🔵 Transport              [Edit] [×] │
│  ☰ 🟡 Eating Out             [Edit] [×] │
│  ☰ 🟣 Entertainment          [Edit] [×] │
│  ☰ 🟤 Shopping               [Edit] [×] │
│  ...                                     │
│                                          │
│  INCOME                                  │
│  ☰ 🟢 Salary                 [Edit] [×] │
│  ☰ 🔵 Benefits               [Edit] [×] │
│  ...                                     │
└──────────────────────────────────────────┘
```

- ☰ = drag handle for reordering (or up/down arrows for keyboard)
- Edit: inline rename + colour picker
- ×: delete (confirmation if category is used by transactions/budgets — "This category is used by 23 transactions. Delete anyway? Transactions will become uncategorised.")
- "+ Add": inline form — name + type (expense/income) + optional colour
- Default categories (seeded on workspace creation) are marked with a subtle "default" badge but can still be edited or deleted.

**2. Inline "add category" in transaction form**

When selecting a category in the quick-add transaction form, the dropdown includes a "+ Add category" option at the bottom. Clicking it opens a minimal inline form (name + type) within the dropdown. Fast path for when a user needs a new category mid-transaction.

### 17.15 Demo Data Banner

Phase 2 section 9 specifies: "persistent banner 'Exploring demo data' with a 'Clear demo data' action."

**Implementation**:

- A `DemoBanner` component rendered at the top of the app layout, below the top bar, above the page content.
- Only shown when `workspaces.is_demo = true` for the active workspace.
- Design: subtle background (light amber or light blue), not full-width alert — sits within the content area.
- Content: "You're exploring demo data. [Clear demo data]"
- "Clear demo data" triggers a confirmation dialog: "This will remove all demo data and leave your workspace blank. You can't undo this."
- On confirm: Server Action deletes all data in the workspace and sets `is_demo = false`.
- Banner disappears after clearing.
- If the user adds real transactions alongside demo data, the banner adds: "You've added your own data too — clearing will only remove the demo entries." (Demo entries are flagged with `is_demo` on relevant tables, or all data is cleared and user is warned — simpler approach for v1: clear everything and warn.)

**v1 simplification**: Clear everything in the workspace (not selective). The confirmation makes this clear. Adding selective demo-data deletion is overengineering for v1.

### 17.16 Page UX — Normal "With Data" States

Phase 4 has empty states, forms, and dashboard layout, but several key pages need their "with data" UX specified.

**Transactions page** (`/app/transactions`):

```
┌──────────────────────────────────────────────┐
│  Transactions                  [+ Transaction]│
│                                              │
│  [Search: payee or description...]           │
│  Filters: [All types ▾] [All categories ▾]  │
│           [All accounts ▾] [Date range ▾]    │
│                                              │
│  ┌─ Today ──────────────────────────────┐    │
│  │ Tesco         Groceries    -£34.50   │    │
│  │ TfL           Transport     -£5.40   │    │
│  └──────────────────────────────────────┘    │
│  ┌─ Yesterday ──────────────────────────┐    │
│  │ Greggs        Eating Out    -£3.85   │    │
│  │ Salary        Income     +£2,400.00  │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  [Load more]  Showing 20 of 147              │
└──────────────────────────────────────────────┘
```

- Grouped by date (Today, Yesterday, date headings)
- Click a row → expands inline to show: notes, account, edit/delete actions (progressive disclosure)
- Search: client-side filter for visible rows, server-side search on submit
- Filters: dropdowns for type, category, account, date range. Applied as query params.
- Pagination: "Load more" button (not infinite scroll — predictable for ND users)
- Income rows shown in teal text, expenses in default text colour. No red/green.

**Accounts page** (`/app/accounts`):

Card grid showing each account:

```
┌─────────────────┐  ┌─────────────────┐
│ Barclays Current │  │ Nationwide Sav. │
│ Current account  │  │ Savings         │
│ £1,847.32        │  │ £3,200.00       │
│ [View →]         │  │ [View →]        │
└─────────────────┘  └─────────────────┘
```

Click → Account detail page: transaction list filtered to that account, balance at top.

**Budgets page** (`/app/budgets`):

Month selector at top: [← Feb] **March 2026** [Apr →]

Category budget cards stacked vertically:

```
Groceries          £218 / £300           73%
████████████████░░░░░░░
Eating Out         £36 / £80             45%
█████████░░░░░░░░░░░░░
Transport          £62 / £100            62%
████████████░░░░░░░░░░
```

- Bar colour: teal when ≤80%, amber when 80–100%, muted red-brown when >100%
- Click a category → shows transactions for that category this month
- "Set budget" button next to categories without budgets

**Bills page** (`/app/bills`):

Two sections: "Upcoming" and "All bills"

Upcoming (next 14 days):

```
Energy        3rd Apr    Direct debit    £85.00
Netflix       20th Apr   Card            £10.99
```

All bills: DataTable with name, amount, frequency, next due, payment method, active toggle.

- `is_subscription` items show a "Sub" badge
- Filter: Subscriptions only / All

**Income page** (`/app/income`):

Card per income source:

```
┌──────────────────────────────────────┐
│ Salary — Acme Ltd           Employment│
│ £2,400/month    Next: 25th Apr       │
│ Pays into: Barclays Current          │
│                         [Edit] [···] │
├──────────────────────────────────────┤
│ Child Benefit              Benefit   │
│ £96.00/4-weekly  Next: 8th Apr       │
│ Pays into: Barclays Current          │
│                         [Edit] [···] │
└──────────────────────────────────────┘
```

Benefits and employment income use the same card design — equal visual weight (Phase 1 principle).

**Debt page** (`/app/debt`):

Card per debt:

```
┌──────────────────────────────────────┐
│ Tesco Credit Card                    │
│ Balance: £412.67                     │
│ Min payment: £25/month               │
│ Interest: 19.9% APR                  │
│ Next payment: 1st Apr                │
│ ████████░░░░░ 73% remaining          │
│                         [Edit] [···] │
└──────────────────────────────────────┘
```

- Progress bar shows payoff progress (if linked to a financial goal)
- If linked to a goal: "Linked to goal: Pay off credit card"

**Analytics page** (`/app/analytics`):

Free users see:

```
Spending by Category (this month)
[Donut chart: Groceries 35%, Transport 15%, ...]

[UpgradeBanner: "Unlock trends, net worth, and forecasting with Pro"]
```

Pro users see:

```
[Period selector: This month / Last 3 months / Last 6 months / Custom]

Spending by Category        Income vs Expenses
[Donut chart]               [Stacked bar chart, monthly]

Spending Over Time
[Line/area chart, monthly trend]

Net Worth
[Single number + trend arrow: £4,634 ↑ from £4,200]
```

**Goal detail page** (`/app/goals/[id]`):

```
┌──────────────────────────────────────┐
│ Holiday Fund              Savings    │
│ £620 / £1,500            41%         │
│ ████████░░░░░░░░░░░░                 │
│ Target date: August 2026             │
│                                      │
│ Contributions                        │
│ 15th Mar   +£100   "March savings"   │
│ 15th Feb   +£100   "Feb savings"     │
│ 10th Jan   +£420   "Initial"         │
│                                      │
│ [+ Add contribution]     [Edit goal] │
└──────────────────────────────────────┘
```

---

_Document version: Phase 4 v1.2 (updated after second audit)_
_Created: 2026-03-30_

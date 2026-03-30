# PerFi — Implementation Phase 2: Public Marketing Site Shell

## Objective

Build the public-facing marketing site shell with all pages, navigation, and content structure from the planning docs. This is a structural shell — not final polish.

---

## What was built

### Shared UI Components (`components/ui/`)

| Component | File         | Purpose                                                                                                                                |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Button    | `button.tsx` | Primary UI button with 5 variants (primary, secondary, outline, ghost, danger) and 3 sizes. Uses Radix Slot for `asChild` composition. |
| Input     | `input.tsx`  | Text input with error state support.                                                                                                   |
| Badge     | `badge.tsx`  | Inline badge with default, accent, muted variants.                                                                                     |

### Shared Components (`components/shared/`)

| Component | File       | Purpose                            |
| --------- | ---------- | ---------------------------------- |
| Logo      | `logo.tsx` | PerFi logo/wordmark link, 3 sizes. |

### Marketing Components (`components/marketing/`)

| Component          | File                | Purpose                                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| MarketingHeader    | `header.tsx`        | Sticky header with desktop nav, mobile hamburger menu, Sign In + Get Started CTAs.        |
| MarketingFooter    | `footer.tsx`        | 4-column footer: brand, product links, support links, legal links. Compliance disclaimer. |
| CTASection         | `cta-section.tsx`   | Reusable CTA banner used at the bottom of every marketing page.                           |
| FAQGroup / FAQItem | `faq-accordion.tsx` | Grouped accordion FAQ component with expand/collapse.                                     |
| ContactForm        | `contact-form.tsx`  | Contact form with name, email, message fields. Client-side success state.                 |
| WaitlistForm       | `waitlist-form.tsx` | Email capture with interest checkboxes, honeypot anti-spam field.                         |

### Marketing Layout

`app/(marketing)/layout.tsx` — Wraps all marketing pages with MarketingHeader + MarketingFooter.

### Pages Built

| Route            | Page             | Content                                                                                                                    |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `/`              | Home             | Hero, problem statement, 4 feature cards, 3 differentiators, pricing preview table, trust/accessibility section, final CTA |
| `/pricing`       | Pricing          | Plan cards (Free + Pro), full 16-row comparison table, pricing FAQ                                                         |
| `/faq`           | FAQ              | 4 grouped accordions (Product, Pricing, Data & Privacy, Accessibility) with 17 Q&As from Phase 2                           |
| `/about`         | About            | Mission statement, founder story, 5 numbered product principles                                                            |
| `/contact`       | Contact          | Contact form (name, email, message), response time note                                                                    |
| `/waitlist`      | Waitlist         | Email capture form with 5 interest checkboxes, honeypot, "what to expect" info                                             |
| `/legal/privacy` | Privacy Policy   | 8-section structured policy covering data collection, storage, retention, rights, cookies, third parties                   |
| `/legal/terms`   | Terms of Service | 9-section structured terms covering service, accounts, plans, refunds, data, use, liability                                |

---

## Navigation Structure

### Header (per Phase 2 Section 1)

```
[Logo/Home]  Features  Pricing  FAQ  About  [Sign In]  [Get Started]
```

- "Features" links to `/#features` (anchor on home page)
- "Get Started" links to `/waitlist` (pre-launch)
- "Sign In" links to `/login`
- Mobile: hamburger menu with same links, "Get Started" stays visible as button

### Footer

```
Brand column | Product (Home, Pricing, FAQ, About) | Support (Contact, Waitlist) | Legal (Privacy, Terms)
```

- Compliance disclaimer: "PerFi is a tracking and planning tool. It does not provide financial advice."

---

## Design System Usage

All pages use the Phase 4 design tokens:

- **Colours**: accent (teal), bg-primary/secondary/tertiary, text-primary/secondary/muted, border
- **Radii**: `--radius-sm`, `--radius-md`, `--radius-lg`
- **Typography**: System sans-serif (Inter when self-hosted), tabular-nums for prices
- **Spacing**: Tailwind 4px grid (p-4, gap-6, py-20)
- **Responsive**: Mobile-first. All pages work at mobile, tablet, desktop breakpoints.
- **Accessibility**: Semantic HTML, visible labels, aria-expanded on accordion/menu, skip link ready

---

## Compliance Positioning

All marketing copy follows Phase 5 Section 5 compliance rules:

- No "we recommend" or "you should" for financial decisions
- No debt payoff strategies or budget suggestions
- Cashflow described as "visibility", not "financial planning"
- Footer and terms include: "PerFi is a tracking and planning tool. It does not provide financial advice."

---

## What This Phase Did NOT Do

- No backend wiring for contact form (client-side only success state)
- No backend wiring for waitlist form (client-side only success state)
- No product screenshots or interactive preview (placeholder area on homepage)
- No SEO meta tags beyond title/description (Open Graph, sitemap, robots.txt deferred)
- No final copywriting polish
- No animations or transitions
- No auth flow implementation
- No database operations

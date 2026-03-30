# PerFi — Implementation Phase 2 Checkpoint

## Phase: Public Marketing Site Shell

## Status: Complete

## Date: 2026-03-30

---

## Checklist

### 1. Public route structure

- [x] Home `/`
- [x] Pricing `/pricing`
- [x] FAQ `/faq`
- [x] About `/about`
- [x] Contact `/contact`
- [x] Waitlist `/waitlist`
- [x] Privacy `/legal/privacy`
- [x] Terms `/legal/terms`

### 2. Shared marketing layout

- [x] Sticky header with desktop nav and mobile hamburger menu
- [x] Navigation: Logo, Features, Pricing, FAQ, About, Sign In, Get Started
- [x] Mobile: hamburger menu with same links, Get Started button always visible
- [x] Footer: 4-column layout with brand, product, support, legal links
- [x] Compliance disclaimer in footer

### 3. Homepage shell

- [x] Hero section: headline, subheadline, primary + secondary CTAs
- [x] Product preview placeholder area
- [x] Problem statement: 3 pain points
- [x] Feature highlights: 4 cards (manual tracking, budgets/goals, cashflow, benefits)
- [x] Differentiators: 3 columns (UK-built, accessible, no bank sync)
- [x] Pricing preview: comparison table with 6 key features
- [x] Trust/accessibility section: 4 trust points
- [x] Final CTA section

### 4. Pricing page

- [x] Free tier card with features list
- [x] Pro tier card (£4.99/month) with features list and "Recommended" badge
- [x] Full 16-row comparison table
- [x] Pricing FAQ (4 questions)

### 5. FAQ page

- [x] Grouped accordion: Product (5 Q&As)
- [x] Grouped accordion: Pricing & Billing (5 Q&As)
- [x] Grouped accordion: Data & Privacy (4 Q&As)
- [x] Grouped accordion: Accessibility (3 Q&As)

### 6. About page

- [x] Mission statement
- [x] Founder story / "Why PerFi exists"
- [x] 5 numbered product principles

### 7. Contact page

- [x] Contact form (name, email, message)
- [x] Response time note
- [x] Client-side success state

### 8. Waitlist page

- [x] Email capture field
- [x] Interest checkboxes (budgeting, cashflow, benefits, debt, goals)
- [x] Honeypot anti-spam field
- [x] "What to expect" info section
- [x] Client-side success state

### 9. Legal pages

- [x] Privacy policy: 8 structured sections
- [x] Terms of service: 9 structured sections
- [x] Compliance disclaimer on both pages

### 10. Shared components

- [x] Button (5 variants, 3 sizes, asChild support)
- [x] Input (with error state)
- [x] Badge (3 variants)
- [x] Logo (3 sizes)
- [x] CTASection (reusable across pages)
- [x] FAQGroup accordion component
- [x] ContactForm
- [x] WaitlistForm
- [x] MarketingHeader
- [x] MarketingFooter

---

## Build Verification

| Check              | Result                                                  |
| ------------------ | ------------------------------------------------------- |
| `npx tsc --noEmit` | Pass (0 errors)                                         |
| `npx eslint .`     | Pass (0 errors, 3 warnings on placeholder params)       |
| `npx next build`   | Pass (all 36 routes render, all marketing pages static) |

---

## Known Caveats

1. **Forms are client-side only**: Contact and waitlist forms show success states but don't submit to the backend. Backend wiring (`/api/contact`, `/api/waitlist`) will be connected when the database is set up.

2. **Product preview is a placeholder**: The homepage has a placeholder area for the interactive product preview / screenshot showcase. Real screenshots can only be added once the app UI is built.

3. **No SEO beyond title/description**: Open Graph tags, sitemap.xml, robots.txt, and structured data are not yet implemented. These should be added before public launch.

4. **Legal content is draft**: Privacy policy and terms have good structure but content should be reviewed by a legal professional before launch.

5. **Inter font not loaded**: Still using system sans-serif. Inter should be self-hosted once deployment is confirmed.

---

## Ready for Phase 3

Phase 3 should cover:

- Database schema and SQL migrations (all 17 tables)
- RLS policies on all tables
- Database triggers (signup, balance update, updated_at)
- Auth flow implementation (signup, login, magic link, password reset)
- Full middleware guard logic (auth, is_disabled, onboarding redirect, admin role)
- Backend wiring for contact and waitlist forms

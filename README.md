# PerFi

UK-focused personal finance planner built for clarity, accessibility, and real life — no bank connections required.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4 + CSS custom property design tokens
- **Components**: Radix UI primitives + Tailwind
- **Database**: Supabase (Postgres + Auth + Row Level Security)
- **Payments**: Stripe (Checkout, webhooks, Customer Portal)
- **Validation**: Zod
- **Charts**: Recharts

## Local Development

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier: [supabase.com](https://supabase.com))
- A Stripe account in test mode (free: [stripe.com](https://stripe.com))

### Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe keys
```

### Environment Variables

See `.env.example` for all required variables. Key variables:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Project Settings > API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard > Developers > Webhooks |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard > Products > Price ID |

### Running

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
```

### Quality Checks

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run format:check # Prettier check
npm run check        # All of the above
```

## Project Structure

```
app/
  (marketing)/     Public marketing pages (home, pricing, FAQ, about, etc.)
  (auth)/          Login, signup, password reset
  app/             Authenticated product (dashboard, accounts, transactions, etc.)
  admin/           Internal admin panel
  api/             Webhooks and public form endpoints
components/
  ui/              UI primitives (Button, Input, Card, etc.)
  shared/          Cross-surface components
  app/             App-specific components
  marketing/       Marketing-specific components
  admin/           Admin-specific components
lib/
  supabase/        Supabase client configurations
  stripe/          Stripe client configuration
  utils/           Utility functions (currency, dates, entitlements)
  validations/     Zod schemas
supabase/
  migrations/      SQL migration files
docs/perfi/        Planning and implementation documentation
```

## Documentation

Planning and implementation docs live in `docs/perfi/`:

- `final-master-plan.md` — consolidated product and technical reference
- `implementation-tracker.md` — build progress log
- `implementation-phase-*` — per-phase implementation details and checkpoints
- `phase-1-*` through `phase-5-*` — original planning documents

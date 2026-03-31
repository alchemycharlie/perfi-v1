# PerFi — Development Roadmap

A running list of improvements, feedback, and planned changes.

---

## Copy & Tone

- [ ] Rewrite all marketing site copy — current language is too sterile and generic, reads like a scaffold placeholder rather than a real product
- [ ] Adopt a casual, approachable tone throughout — the site should feel human, not corporate
- [ ] Remove or rewrite technical jargon that the general public wouldn't understand or care about (e.g. FAQ answer mentioning "Supabase PostgreSQL database" — users don't need to know the tech stack)
- [ ] Review FAQ entries for relevance — cut questions that only matter to developers, focus on what real users would actually ask
- [ ] Audit all page headings, subheadings, and CTAs for personality and clarity

## Stripe Setup

- [ ] Create Pro plan product and price in Stripe dashboard (£4.99/month)
- [ ] Add `STRIPE_SECRET_KEY` to Vercel env vars (from Developers > API keys)
- [ ] Create webhook endpoint in Stripe pointing to `https://perfi-v1.vercel.app/api/webhooks/stripe` — subscribe to: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.paid`
- [ ] Add `STRIPE_WEBHOOK_SECRET` to Vercel env vars (from Developers > Webhooks, after creating the endpoint)
- [ ] Add `STRIPE_PRO_PRICE_ID` to Vercel env vars (from Product Catalog, after creating the price)

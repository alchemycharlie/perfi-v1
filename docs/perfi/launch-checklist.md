# PerFi — Launch Checklist

## Pre-Launch (Before First User)

### Infrastructure

- [ ] Supabase project created and configured (EU region)
- [ ] All 6 SQL migrations applied (`supabase db push`)
- [ ] RLS policies verified (cross-user data isolation test)
- [ ] Supabase Auth configured: email+password, magic link, email verification
- [ ] Supabase Auth email templates customised (verification, reset, magic link)
- [ ] Vercel project created and deployed
- [ ] Environment variables set in Vercel (all 7 from .env.example)
- [ ] Custom domain configured with Cloudflare DNS
- [ ] SSL verified (automatic via Vercel)

### Stripe

- [ ] Stripe account configured with live keys
- [ ] Pro product and price created (£4.99/month, price ID set in env)
- [ ] Webhook endpoint registered: `https://domain/api/webhooks/stripe`
- [ ] Webhook events enabled: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed, invoice.paid
- [ ] Webhook signing secret set in environment variables
- [ ] Test checkout flow end-to-end

### Auth

- [ ] Signup flow verified: email → verification → onboarding → dashboard
- [ ] Login flow verified: email+password and magic link
- [ ] Password reset flow verified
- [ ] Middleware redirects verified: unauthenticated → login, unboarded → onboarding
- [ ] Admin role gating verified: non-admin cannot access /admin/\*

### Data

- [ ] Demo data seeding verified (onboarding step 5)
- [ ] Default category seeding verified (both workspace types)
- [ ] Transaction balance trigger verified (auto-updates account balance)
- [ ] Signup trigger verified (auto-creates profile + subscription)

### Legal

- [ ] Privacy policy content reviewed by legal professional
- [ ] Terms of service content reviewed by legal professional
- [ ] [Date] fields updated in both legal pages
- [ ] Compliance disclaimer present in footer and legal pages

### SEO

- [ ] robots.txt serves correctly
- [ ] sitemap.xml serves correctly with all marketing pages
- [ ] Open Graph metadata set on all marketing pages
- [ ] Page titles follow "Page Name | PerFi" template

---

## Launch Day

### Admin Setup

- [ ] Create admin user (set profiles.role = 'admin' in database)
- [ ] Verify admin panel access and all 7 pages load with data
- [ ] Set feature flags if needed (signups_enabled, maintenance_mode)

### Marketing

- [ ] Landing page live and rendering correctly
- [ ] Waitlist form submitting to database
- [ ] Contact form submitting to database
- [ ] All marketing page links working (pricing, FAQ, about, legal)

### Monitoring

- [ ] Sentry error tracking configured (optional for v1)
- [ ] Vercel deployment logs accessible
- [ ] Supabase dashboard accessible for database monitoring

### Waitlist Launch

- [ ] Email waitlist subscribers with launch announcement
- [ ] Switch CTAs from "Join waitlist" to "Get Started" (or keep waitlist for controlled rollout)

---

## Post-Launch (First Week)

- [ ] Monitor for JavaScript errors (Sentry or Vercel logs)
- [ ] Monitor Stripe webhook delivery (Stripe Dashboard → Webhooks)
- [ ] Check first user signups complete onboarding successfully
- [ ] Verify RLS: no cross-user data leakage
- [ ] Check responsive behaviour on real mobile devices
- [ ] Keyboard-navigate through all app pages (accessibility spot-check)
- [ ] Run axe-core on key pages (dashboard, transactions, budgets)

---

## Known Deferred Items (v1.1)

These items are intentionally not included in v1 launch:

- [ ] Dark mode
- [ ] Email notifications (bill reminders)
- [ ] Resend email integration (waitlist confirmation, invites)
- [ ] OAuth (Google/Apple sign-in)
- [ ] Annual billing
- [ ] Recurring transaction templates
- [ ] Setup assistant (re-onboarding from Settings)
- [ ] CSV import
- [ ] Audit logging
- [ ] axe-core in CI pipeline
- [ ] Custom date range on analytics
- [ ] Cashflow month navigation

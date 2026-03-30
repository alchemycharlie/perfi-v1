import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CTASection } from '@/components/marketing/cta-section';

// ── Feature card data (Phase 4 Section 13: 4 feature highlight cards) ──

const features = [
  {
    title: 'Track everything manually',
    description:
      'Add accounts, log transactions, and see your balances. No bank sync, no fuss. You are in control.',
    icon: '📒',
  },
  {
    title: 'Budgets and goals',
    description:
      'Set spending limits by category. Save toward what matters. See your progress at a glance.',
    icon: '🎯',
  },
  {
    title: 'Cashflow calendar',
    description:
      'See when money comes in and goes out. Know exactly where you stand on any given day.',
    icon: '📅',
  },
  {
    title: 'Benefits-aware',
    description:
      'Universal Credit, PIP, Child Benefit, Carer\u2019s Allowance \u2014 tracked with the same dignity as a salary.',
    icon: '🤝',
  },
];

const differentiators = [
  {
    title: 'Built for the UK',
    description:
      'GBP. Direct debits. Pay dates. Council tax. Designed around how money actually works here.',
  },
  {
    title: 'Designed for everyone',
    description:
      'Calm, clear, and accessible by default. Built with neurodivergent users in mind.',
  },
  {
    title: 'No bank connections',
    description:
      'You control your data. No Open Banking, no API sync, no anxiety about sharing credentials.',
  },
];

const trustPoints = [
  {
    title: 'WCAG 2.1 AA compliant',
    description: 'Tested with screen readers and keyboard navigation. Accessibility is not an afterthought.',
  },
  {
    title: 'Neurodiversity-conscious design',
    description: 'Low cognitive load, predictable layout, progressive disclosure. Calm by default.',
  },
  {
    title: 'Your data stays yours',
    description: 'No selling data, no third-party analytics tracking, no advertising cookies.',
  },
  {
    title: 'Delete anytime',
    description: 'Fully deletable data. No dark patterns, no lock-in, no guilt trips.',
  },
];

const pricingHighlights = [
  { feature: 'Accounts', free: 'Up to 3', pro: 'Unlimited' },
  { feature: 'Budgets', free: 'Up to 5', pro: 'Unlimited' },
  { feature: 'Goals', free: 'Up to 2', pro: 'Unlimited' },
  { feature: 'Bills & income tracking', free: 'Yes', pro: 'Yes' },
  { feature: 'Cashflow forecasting', free: '\u2014', pro: 'Yes' },
  { feature: 'Advanced analytics', free: '\u2014', pro: 'Yes' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="px-6 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="accent">Now in early access</Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Your money. Your way.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            A calm, accessible personal finance tool built for the UK. Track your income
            &mdash; including benefits &mdash; manage budgets, and see your cashflow clearly.
            No bank sync needed.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/waitlist">Get Started &mdash; it&apos;s free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>

        {/* Product preview placeholder */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-secondary">
            <div className="flex h-64 items-center justify-center sm:h-80 lg:h-96">
              <div className="text-center">
                <p className="text-sm font-medium text-text-muted">
                  Interactive product preview
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Dashboard, budgets, cashflow calendar &mdash; screenshot showcase coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem statement ── */}
      <section className="border-t border-border bg-bg-secondary px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Managing money shouldn&apos;t feel this hard
          </h2>
          <div className="mt-10 grid gap-8 text-left sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Bank sync isn&apos;t for everyone</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Most finance apps demand bank connections. PerFi lets you stay in control of your own data.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Spreadsheets only go so far</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Spreadsheets work, but they don&apos;t show bill due dates, budget tracking, or cashflow visibility.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Clarity, not clutter</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Many budgeting apps are overwhelming. PerFi is designed to be calm, predictable, and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Everything you need to see your money clearly
            </h2>
            <p className="mt-4 text-text-secondary">
              Track, plan, and organise &mdash; all in one place.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6"
              >
                <span className="text-2xl" role="img" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiators ── */}
      <section className="border-t border-border bg-bg-secondary px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Why PerFi?
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {differentiators.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Free to start. Upgrade when you need more.
            </h2>
            <p className="mt-4 text-text-secondary">
              The free plan is genuinely useful. Pro unlocks scale and depth.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Feature</th>
                  <th className="px-4 py-3 text-center font-semibold text-text-primary">Free</th>
                  <th className="px-4 py-3 text-center font-semibold text-accent">
                    Pro &mdash; &pound;4.99/mo
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingHighlights.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-secondary'}>
                    <td className="px-4 py-3 text-text-primary">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-text-secondary">{row.free}</td>
                    <td className="px-4 py-3 text-center text-text-primary">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">See full comparison</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Trust / Accessibility ── */}
      <section className="border-t border-border bg-bg-secondary px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Built on trust, not tracking
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point.title}>
                <h3 className="text-sm font-semibold text-text-primary">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <CTASection />
    </>
  );
}

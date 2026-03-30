import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CTASection } from '@/components/marketing/cta-section';

export const metadata: Metadata = {
  title: 'Pricing — PerFi',
  description: 'Free to start. Pro for £4.99/month. See what each plan includes.',
};

const comparisonRows = [
  { feature: 'Accounts', free: 'Up to 3', pro: 'Unlimited' },
  { feature: 'Transactions', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Budgets', free: 'Up to 5 categories', pro: 'Unlimited categories' },
  { feature: 'Bills tracking', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Goals', free: 'Up to 2', pro: 'Unlimited' },
  { feature: 'Debt tracking', free: 'Yes', pro: 'Yes' },
  { feature: 'Income tracking (incl. benefits)', free: 'Yes', pro: 'Yes' },
  { feature: 'Cashflow calendar', free: 'Yes', pro: 'Yes' },
  { feature: 'Dashboard', free: 'Yes', pro: 'Yes' },
  { feature: 'Subscription tracking', free: 'Yes', pro: 'Yes' },
  { feature: 'Workspaces', free: '1', pro: 'Up to 5' },
  { feature: 'Analytics & trends', free: 'Basic', pro: 'Advanced + trends + net worth' },
  { feature: 'Cashflow forecasting', free: '\u2014', pro: 'Yes' },
  { feature: 'Net worth tracking', free: '\u2014', pro: 'Yes' },
  { feature: 'CSV import', free: '\u2014', pro: 'Yes' },
  { feature: 'CSV export', free: 'Basic', pro: 'Full' },
];

export default function PricingPage() {
  return (
    <>
      <section className="px-6 pb-20 pt-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
          </div>

          {/* Plan cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
              <h2 className="text-lg font-semibold text-text-primary">Free</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold tabular-nums text-text-primary">&pound;0</span>
                <span className="text-text-muted"> / forever</span>
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                Everything you need to get started. No time limit, no credit card required.
              </p>
              <Button asChild variant="outline" size="md" className="mt-6 w-full">
                <Link href="/waitlist">Get Started</Link>
              </Button>
              <ul className="mt-6 space-y-2 text-sm text-text-secondary">
                <li>Up to 3 accounts</li>
                <li>Up to 5 budget categories</li>
                <li>Up to 2 goals</li>
                <li>Unlimited transactions</li>
                <li>Bills & income tracking</li>
                <li>Cashflow calendar</li>
                <li>Basic analytics</li>
              </ul>
            </div>

            {/* Pro tier */}
            <div className="rounded-[var(--radius-lg)] border-2 border-accent bg-bg-primary p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">Pro</h2>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Recommended
                </span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold tabular-nums text-text-primary">&pound;4.99</span>
                <span className="text-text-muted"> / month</span>
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                Unlock unlimited tracking, advanced analytics, and cashflow forecasting.
              </p>
              <Button asChild size="md" className="mt-6 w-full">
                <Link href="/waitlist">Get Started</Link>
              </Button>
              <ul className="mt-6 space-y-2 text-sm text-text-secondary">
                <li>Unlimited accounts, budgets & goals</li>
                <li>Up to 5 workspaces</li>
                <li>Advanced analytics & trends</li>
                <li>Net worth tracking</li>
                <li>Cashflow forecasting</li>
                <li>CSV import & full export</li>
                <li>Everything in Free</li>
              </ul>
            </div>
          </div>

          {/* Full comparison table */}
          <div className="mt-16">
            <h2 className="text-center text-xl font-semibold text-text-primary">
              Full feature comparison
            </h2>
            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-border">
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
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-secondary'}
                    >
                      <td className="px-4 py-3 text-text-primary">{row.feature}</td>
                      <td className="px-4 py-3 text-center text-text-secondary">{row.free}</td>
                      <td className="px-4 py-3 text-center text-text-primary">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16">
            <h2 className="text-center text-xl font-semibold text-text-primary">
              Pricing questions
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Is the free plan really free?</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Yes. No time limit, no credit card required, no feature degradation. The free plan is permanent.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Can I cancel Pro anytime?</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Yes. Cancel at any time and keep access until the end of your billing period. Your data is preserved — you just lose access to Pro features.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Is there a free trial of Pro?</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Not currently. The free plan is generous enough to evaluate PerFi fully before upgrading.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Will there be annual billing?</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Not yet, but it&apos;s planned. Monthly billing only for now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

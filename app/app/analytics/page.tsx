import { UpgradeBanner } from '@/components/shared/upgrade-banner';

/**
 * Analytics page.
 * Phase 4: Basic analytics on Free, advanced on Pro.
 * Full chart implementation deferred to a later phase.
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
      <p className="text-sm text-text-secondary">
        See how your spending, income, and budgets are trending over time.
      </p>

      {/* Basic analytics (free) - placeholder */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
        <h2 className="text-sm font-semibold text-text-primary">Spending by category</h2>
        <p className="mt-2 text-sm text-text-muted">
          Charts and spending breakdowns will appear here once you have enough transaction data.
        </p>
      </section>

      {/* Pro analytics teaser */}
      <UpgradeBanner
        feature="Advanced analytics"
        message="Unlock trends over time, net worth tracking, and cashflow forecasting with Pro."
      />
    </div>
  );
}

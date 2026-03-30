'use client';

import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils/currency';
import { UpgradeBanner } from '@/components/shared/upgrade-banner';

const ForecastChart = dynamic(
  () => import('@/components/app/cashflow/forecast-chart').then((m) => m.ForecastChart),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded bg-bg-tertiary" /> },
);

interface BalanceForecastProps {
  dailyBalances: Array<{ date: string; balance: number }>;
  isPro: boolean;
}

/**
 * Cashflow balance forecast sparkline.
 * Phase 4: Shows projected balance across the month.
 * Pro feature per pricing table.
 */
export function BalanceForecast({ dailyBalances, isPro }: BalanceForecastProps) {
  if (!isPro) {
    return (
      <UpgradeBanner
        feature="Cashflow forecasting"
        message="See your projected balance across the month. Know exactly where you'll stand."
      />
    );
  }

  if (dailyBalances.length === 0) return null;

  const minBalance = Math.min(...dailyBalances.map((d) => d.balance));
  const maxBalance = Math.max(...dailyBalances.map((d) => d.balance));

  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Projected balance</h2>
        <div className="flex gap-4 text-xs tabular-nums text-text-muted">
          <span>Low: {formatCurrency(minBalance)}</span>
          <span>High: {formatCurrency(maxBalance)}</span>
        </div>
      </div>
      <div className="mt-3">
        <ForecastChart data={dailyBalances} />
      </div>
    </section>
  );
}

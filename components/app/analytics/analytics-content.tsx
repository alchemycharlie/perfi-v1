'use client';

import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils/currency';
import { UpgradeBanner } from '@/components/shared/upgrade-banner';
import { EmptyState } from '@/components/shared/empty-state';

// Code-split Recharts — not loaded on non-analytics pages
const SpendingDonut = dynamic(
  () => import('@/components/app/analytics/spending-donut').then((m) => m.SpendingDonut),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const IncomeVsExpenses = dynamic(
  () => import('@/components/app/analytics/income-vs-expenses').then((m) => m.IncomeVsExpenses),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const SpendingTrend = dynamic(
  () => import('@/components/app/analytics/spending-trend').then((m) => m.SpendingTrend),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

interface Transaction {
  amount: number;
  type: string;
  date: string;
  category: { name: string; colour: string | null } | null;
}

interface AnalyticsContentProps {
  transactions: Transaction[];
  netWorth: number;
  isPro: boolean;
}

export function AnalyticsContent({ transactions, netWorth, isPro }: AnalyticsContentProps) {
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
        <EmptyState
          title="Not enough data yet"
          description="Add some transactions to start seeing your spending patterns and trends."
          actionLabel="Add transaction"
          actionHref="/app/transactions"
        />
      </div>
    );
  }

  // ── Compute spending by category (current month) ──
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const spendingByCategory = new Map<string, { name: string; colour: string; total: number }>();
  for (const txn of transactions) {
    if (txn.type !== 'expense') continue;
    if (!txn.date.startsWith(currentMonth)) continue;
    const catName = txn.category?.name || 'Uncategorised';
    const catColour = txn.category?.colour || '#9ca3af';
    const existing = spendingByCategory.get(catName) || {
      name: catName,
      colour: catColour,
      total: 0,
    };
    existing.total += txn.amount;
    spendingByCategory.set(catName, existing);
  }

  const donutData = Array.from(spendingByCategory.values())
    .sort((a, b) => b.total - a.total)
    .map((d) => ({ name: d.name, value: Math.round(d.total * 100) / 100, fill: d.colour }));

  // ── Monthly income vs expenses (last 6 months) ──
  const monthlyData = new Map<string, { month: string; income: number; expenses: number }>();
  for (const txn of transactions) {
    const month = txn.date.substring(0, 7);
    const existing = monthlyData.get(month) || { month, income: 0, expenses: 0 };
    if (txn.type === 'income') existing.income += txn.amount;
    else if (txn.type === 'expense') existing.expenses += txn.amount;
    monthlyData.set(month, existing);
  }

  const barData = Array.from(monthlyData.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      month: formatMonthLabel(d.month),
      income: Math.round(d.income * 100) / 100,
      expenses: Math.round(d.expenses * 100) / 100,
    }));

  // ── Spending trend (monthly totals) ──
  const trendData = Array.from(monthlyData.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      month: formatMonthLabel(d.month),
      spending: Math.round(d.expenses * 100) / 100,
    }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>

      {/* ── Spending by category (free) ── */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
        <h2 className="text-sm font-semibold text-text-primary">
          Spending by category
          <span className="ml-2 text-xs font-normal text-text-muted">
            {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </span>
        </h2>
        {donutData.length > 0 ? (
          <div className="mt-4">
            <SpendingDonut data={donutData} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-muted">No expenses this month.</p>
        )}
      </section>

      {/* ── Pro analytics ── */}
      {isPro ? (
        <>
          {/* Income vs Expenses */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
            <h2 className="text-sm font-semibold text-text-primary">Income vs Expenses</h2>
            {barData.length > 1 ? (
              <div className="mt-4">
                <IncomeVsExpenses data={barData} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">Need at least 2 months of data.</p>
            )}
          </section>

          {/* Spending trend */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
            <h2 className="text-sm font-semibold text-text-primary">Spending over time</h2>
            {trendData.length > 1 ? (
              <div className="mt-4">
                <SpendingTrend data={trendData} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">Need at least 2 months of data.</p>
            )}
          </section>

          {/* Net worth */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
            <h2 className="text-sm font-semibold text-text-primary">Net worth</h2>
            <p className="mt-2 text-3xl font-bold tabular-nums text-text-primary">
              {formatCurrency(netWorth)}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Sum of all account balances. Updates automatically with transactions.
            </p>
          </section>
        </>
      ) : (
        <UpgradeBanner
          feature="Advanced analytics"
          message="Unlock trends over time, income vs expenses charts, net worth tracking, and cashflow forecasting with Pro."
        />
      )}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-bg-tertiary" />
    </div>
  );
}

function formatMonthLabel(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-GB', { month: 'short' });
}

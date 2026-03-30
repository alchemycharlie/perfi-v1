'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/lib/hooks/workspace-context';
import { DemoBanner } from '@/components/app/demo-banner';
import { GuidedTour } from '@/components/app/guided-tour';
import { EmptyState } from '@/components/shared/empty-state';
import { formatCurrency } from '@/lib/utils/currency';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface DashboardContentProps {
  displayName: string;
  workspace: { id: string; name: string; is_demo: boolean } | null;
  accounts: Array<{ id: string; name: string; type: string; balance: number; is_active: boolean }>;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: string;
    date: string;
    category: { name: string; colour: string | null } | null;
  }>;
  upcomingBills: Array<{ id: string; name: string; amount: number; next_due_date: string }>;
  budgetSummary: Array<{
    id: string;
    amount: number;
    category_name: string;
    category_colour: string | null;
    spent: number;
  }>;
  goals: Array<{
    id: string;
    name: string;
    type: string;
    target_amount: number;
    current_amount: number;
    status: string;
  }>;
  nextPayDay: { name: string; date: string } | null;
  hasSeenTour: boolean;
  userId: string;
}

export function DashboardContent({
  displayName,
  workspace,
  accounts,
  recentTransactions,
  upcomingBills,
  budgetSummary,
  goals,
  nextPayDay,
  hasSeenTour,
  userId,
}: DashboardContentProps) {
  const { setActiveWorkspaceId } = useWorkspace();
  const [tourDismissed, setTourDismissed] = useState(false);
  const showTour = workspace?.is_demo && !hasSeenTour && !tourDismissed;

  useEffect(() => {
    if (workspace?.id) setActiveWorkspaceId(workspace.id);
  }, [workspace?.id, setActiveWorkspaceId]);

  async function handleTourComplete() {
    setTourDismissed(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ preferences: { has_seen_tour: true } })
      .eq('id', userId);
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const hasData = accounts.length > 0;

  // Days until next pay day (computed once, not reactive to time)
  const [daysUntilPay] = useState(() => {
    if (!nextPayDay) return null;
    return Math.ceil(
      (new Date(nextPayDay.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
  });

  return (
    <>
      {workspace?.is_demo && <DemoBanner />}
      {showTour && <GuidedTour onComplete={handleTourComplete} />}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {hasData ? `Welcome back, ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hasData ? 'Here\u2019s your financial overview.' : 'Let\u2019s get started.'}
          </p>
        </div>

        {hasData ? (
          <>
            {/* ── Total balance + accounts ── */}
            <section>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
                <p className="text-sm text-text-secondary">Total Balance</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-text-primary">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {accounts.map((a) => (
                  <Link
                    key={a.id}
                    href={`/app/accounts/${a.id}`}
                    className="shrink-0 rounded-[var(--radius-md)] border border-border bg-bg-primary px-4 py-3 transition-colors hover:border-accent/30"
                  >
                    <p className="text-xs text-text-muted">{a.name}</p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-text-primary">
                      {formatCurrency(a.balance)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Summary cards grid ── */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Next pay day */}
              {nextPayDay && (
                <Link
                  href="/app/income"
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 transition-colors hover:border-accent/30"
                >
                  <p className="text-sm text-text-secondary">Next pay day</p>
                  <p className="mt-1 text-base font-semibold text-text-primary">
                    {nextPayDay.date}
                  </p>
                  <p className="text-xs text-text-muted">
                    {nextPayDay.name}
                    {daysUntilPay !== null && daysUntilPay >= 0 && (
                      <> &middot; {daysUntilPay === 0 ? 'Today' : `${daysUntilPay} days`}</>
                    )}
                  </p>
                </Link>
              )}

              {/* Upcoming bills */}
              <Link
                href="/app/bills"
                className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 transition-colors hover:border-accent/30"
              >
                <p className="text-sm text-text-secondary">Upcoming bills</p>
                {upcomingBills.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {upcomingBills.slice(0, 3).map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between text-sm">
                        <span className="text-text-primary">{bill.name}</span>
                        <span className="tabular-nums text-text-muted">
                          {formatCurrency(bill.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-text-muted">No upcoming bills</p>
                )}
              </Link>
            </div>

            {/* ── Budget status ── */}
            {budgetSummary.length > 0 && (
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary">Budget status</h2>
                  <Link href="/app/budgets" className="text-xs text-accent hover:text-accent-hover">
                    View all
                  </Link>
                </div>
                <div className="mt-3 space-y-2">
                  {budgetSummary.slice(0, 4).map((b) => {
                    const pct = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0;
                    const over = b.spent > b.amount;
                    const near = pct >= 80 && !over;
                    return (
                      <div key={b.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-primary">{b.category_name}</span>
                          <span className="tabular-nums text-text-muted">
                            {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              over ? 'bg-danger' : near ? 'bg-warning' : 'bg-accent',
                            )}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Goals progress ── */}
            {goals.length > 0 && (
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary">Goals</h2>
                  <Link href="/app/goals" className="text-xs text-accent hover:text-accent-hover">
                    View all
                  </Link>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {goals.map((g) => {
                    const pct =
                      g.target_amount > 0
                        ? Math.round((g.current_amount / g.target_amount) * 100)
                        : 0;
                    return (
                      <Link
                        key={g.id}
                        href={`/app/goals/${g.id}`}
                        className="rounded-[var(--radius-md)] border border-border bg-bg-primary p-3 transition-colors hover:border-accent/30"
                      >
                        <p className="text-sm font-medium text-text-primary">{g.name}</p>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs tabular-nums text-text-muted">
                          {formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Recent transactions ── */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary">Recent transactions</h2>
                <Link
                  href="/app/transactions"
                  className="text-xs text-accent hover:text-accent-hover"
                >
                  View all
                </Link>
              </div>
              {recentTransactions.length > 0 ? (
                <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{txn.description}</p>
                        <p className="text-xs text-text-muted">
                          {txn.category?.name || 'Uncategorised'} &middot; {txn.date}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          txn.type === 'income' ? 'text-success' : 'text-text-primary'
                        }`}
                      >
                        {txn.type === 'income' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-text-muted">No transactions yet.</p>
              )}
            </section>
          </>
        ) : (
          <div className="mt-4 space-y-6">
            <EmptyState
              title="No accounts yet"
              description="Add your first account to start tracking your finances."
              actionLabel="Add account"
              actionHref="/app/accounts"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary">Quick start</h3>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  <li>1. Add an account</li>
                  <li>2. Log a few transactions</li>
                  <li>3. Set a budget</li>
                  <li>4. Check your cashflow</li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary">Your categories</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Default categories are set up. Customise them in Settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

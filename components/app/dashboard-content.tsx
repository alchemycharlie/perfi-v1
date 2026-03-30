'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from '@/lib/hooks/workspace-context';
import { DemoBanner } from '@/components/app/demo-banner';
import { GuidedTour } from '@/components/app/guided-tour';
import { EmptyState } from '@/components/shared/empty-state';
import { formatCurrency } from '@/lib/utils/currency';
import { createClient } from '@/lib/supabase/client';

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
  hasSeenTour: boolean;
  userId: string;
}

export function DashboardContent({
  displayName,
  workspace,
  accounts,
  recentTransactions,
  upcomingBills,
  hasSeenTour,
  userId,
}: DashboardContentProps) {
  const { setActiveWorkspaceId } = useWorkspace();
  const [tourDismissed, setTourDismissed] = useState(false);
  const showTour = workspace?.is_demo && !hasSeenTour && !tourDismissed;

  // Set workspace context on mount
  useEffect(() => {
    if (workspace?.id) {
      setActiveWorkspaceId(workspace.id);
    }
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

  return (
    <>
      {workspace?.is_demo && <DemoBanner />}
      {showTour && <GuidedTour onComplete={handleTourComplete} />}

      <div className="space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {hasData ? `Welcome back, ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hasData
              ? 'Here\u2019s your financial overview.'
              : 'Let\u2019s get started with your finances.'}
          </p>
        </div>

        {hasData ? (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Total Balance" value={formatCurrency(totalBalance)} />
              <StatCard
                title="Accounts"
                value={String(accounts.length)}
                subtitle={accounts.map((a) => a.name).join(', ')}
              />
              <StatCard
                title="Upcoming Bills"
                value={String(upcomingBills.length)}
                subtitle={
                  upcomingBills.length > 0
                    ? `Next: ${upcomingBills[0].name} — ${formatCurrency(upcomingBills[0].amount)}`
                    : 'No upcoming bills'
                }
              />
            </div>

            {/* Account balances */}
            <section>
              <h2 className="text-sm font-semibold text-text-primary">Accounts</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-[var(--radius-md)] border border-border bg-bg-primary p-4"
                  >
                    <p className="text-sm text-text-secondary">{account.name}</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent transactions */}
            <section>
              <h2 className="text-sm font-semibold text-text-primary">Recent Transactions</h2>
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
          /* Empty state for blank workspace */
          <div className="mt-4 space-y-6">
            <EmptyState
              title="No accounts yet"
              description="Add your first account to start tracking your finances — current accounts, savings, credit cards, or cash."
              actionLabel="Add account"
              actionHref="/app/accounts"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary">Quick start</h3>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  <li>1. Add an account (current, savings, or credit card)</li>
                  <li>2. Log a few transactions</li>
                  <li>3. Set a budget for a spending category</li>
                  <li>4. Check your cashflow calendar</li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary">Your categories</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Default categories have been set up based on your workspace type. You can
                  customise them in Settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
      {subtitle && <p className="mt-1 truncate text-xs text-text-muted">{subtitle}</p>}
    </div>
  );
}

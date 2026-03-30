import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { AddGoalDialog } from '@/components/app/goals/add-goal-dialog';

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership) return null;
  const workspaceId = membership.workspace_id;

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at');

  const { data: debts } = await supabase
    .from('debts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('type', 'expense');

  const activeGoals = (goals || []).filter((g) => g.status === 'active');
  const completedGoals = (goals || []).filter((g) => g.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Goals</h1>
        <AddGoalDialog
          workspaceId={workspaceId}
          debts={debts || []}
          categories={categories || []}
        />
      </div>

      {(goals || []).length === 0 ? (
        <EmptyState
          title="No goals yet"
          description="Set a savings target or a financial goal to work toward."
        />
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeGoals.map((goal) => {
                const progress =
                  goal.target_amount > 0
                    ? Math.round((goal.current_amount / goal.target_amount) * 100)
                    : 0;
                return (
                  <Link
                    key={goal.id}
                    href={`/app/goals/${goal.id}`}
                    className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 transition-colors hover:border-accent/30"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-text-primary">{goal.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          goal.type === 'savings'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {goal.type === 'savings' ? 'Savings' : 'Financial'}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-semibold tabular-nums text-text-primary">
                      {formatCurrency(goal.current_amount)}{' '}
                      <span className="text-sm font-normal text-text-muted">
                        / {formatCurrency(goal.target_amount)}
                      </span>
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      {progress}% complete
                      {goal.target_date && <> &middot; Target: {goal.target_date}</>}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          {completedGoals.length > 0 && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-text-secondary">
                Completed ({completedGoals.length})
              </summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-4 opacity-75"
                  >
                    <h3 className="text-sm font-medium text-text-primary">{goal.name}</h3>
                    <p className="text-xs text-text-muted">
                      {formatCurrency(goal.target_amount)} — completed
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}

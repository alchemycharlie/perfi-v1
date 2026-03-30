import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { GoalDetailContent } from '@/components/app/goals/goal-detail-content';

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: goal } = await supabase.from('goals').select('*').eq('id', id).single();
  if (!goal) notFound();

  const { data: contributions } = await supabase
    .from('goal_contributions')
    .select('id, amount, date, notes')
    .eq('goal_id', id)
    .order('date', { ascending: false });

  const progress =
    goal.target_amount > 0 ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/app/goals"
        className="text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        &larr; Goals
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-text-primary">{goal.name}</h1>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              goal.type === 'savings' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'
            }`}
          >
            {goal.type === 'savings' ? 'Savings' : 'Financial'}
          </span>
        </div>

        <p className="mt-2 text-3xl font-bold tabular-nums text-text-primary">
          {formatCurrency(goal.current_amount)}{' '}
          <span className="text-lg font-normal text-text-muted">
            / {formatCurrency(goal.target_amount)}
          </span>
        </p>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-text-muted">
          {progress}% complete
          {goal.target_date && <> &middot; Target: {goal.target_date}</>}
        </p>

        {progress >= 100 && goal.status === 'active' && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-accent/20 bg-accent/5 p-3">
            <p className="text-sm font-medium text-accent">You did it! 🎉</p>
            <p className="mt-1 text-xs text-text-secondary">
              You&apos;ve reached your target. Mark this goal as completed when you&apos;re ready.
            </p>
          </div>
        )}
      </div>

      <GoalDetailContent
        goalId={goal.id}
        workspaceId={goal.workspace_id}
        goalStatus={goal.status}
        contributions={contributions || []}
      />
    </div>
  );
}

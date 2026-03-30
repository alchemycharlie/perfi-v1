'use client';

import { useState } from 'react';
import { addContribution, updateGoalStatus, deleteGoal } from '@/lib/actions/goals';
import { formatCurrency } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface Props {
  goalId: string;
  workspaceId: string;
  goalStatus: string;
  contributions: Array<{ id: string; amount: number; date: string; notes: string | null }>;
}

export function GoalDetailContent({ goalId, workspaceId, goalStatus, contributions }: Props) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  async function handleAddContribution(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await addContribution(goalId, workspaceId, { success: false }, formData);
    setLoading(false);
    if (result.success) setShowAddForm(false);
    else setError(result.error || 'Failed to add contribution.');
  }

  async function handleStatusChange(status: 'completed' | 'abandoned') {
    setLoading(true);
    await updateGoalStatus(goalId, status);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteGoal(goalId);
    router.push('/app/goals');
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      {goalStatus === 'active' && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add contribution'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            disabled={loading}
          >
            Mark as completed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange('abandoned')}
            disabled={loading}
          >
            Abandon goal
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      )}

      {/* Add contribution form */}
      {showAddForm && (
        <form
          action={handleAddContribution}
          className="rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary">Amount</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-text-secondary">&pound;</span>
                <Input name="amount" type="number" step="0.01" min="0.01" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Date</label>
              <Input name="date" type="date" required defaultValue={today} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Notes <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <Input name="notes" placeholder="e.g. March savings" className="mt-1" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? 'Adding...' : 'Add contribution'}
          </Button>
        </form>
      )}

      {/* Contribution history */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary">Contributions</h2>
        {contributions.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No contributions yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
            {contributions.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-text-muted">{c.date}</p>
                  {c.notes && <p className="text-xs text-text-muted">{c.notes}</p>}
                </div>
                <span className="text-sm font-medium tabular-nums text-success">
                  +{formatCurrency(c.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

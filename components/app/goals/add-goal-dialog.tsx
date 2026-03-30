'use client';

import { useState } from 'react';
import { createGoal } from '@/lib/actions/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GoalType } from '@/lib/types/database';

interface Props {
  workspaceId: string;
  debts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export function AddGoalDialog({ workspaceId, debts, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goalType, setGoalType] = useState<GoalType>('savings');

  async function handleSubmit(formData: FormData) {
    formData.set('type', goalType);
    setLoading(true);
    setError(null);
    const result = await createGoal(workspaceId, { success: false }, formData);
    setLoading(false);
    if (result.success) {
      setOpen(false);
      setGoalType('savings');
    } else setError(result.error || 'Failed to create goal.');
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Create goal
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Create goal</h2>
        <form action={handleSubmit} className="mt-4 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGoalType('savings')}
              className={`flex-1 rounded-[var(--radius-md)] py-2 text-sm font-medium ${goalType === 'savings' ? 'bg-accent text-white' : 'border border-border text-text-secondary'}`}
            >
              Save toward something
            </button>
            <button
              type="button"
              onClick={() => setGoalType('financial')}
              className={`flex-1 rounded-[var(--radius-md)] py-2 text-sm font-medium ${goalType === 'financial' ? 'bg-accent text-white' : 'border border-border text-text-secondary'}`}
            >
              Financial target
            </button>
          </div>

          <div>
            <label htmlFor="goal-name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              id="goal-name"
              name="name"
              required
              placeholder={
                goalType === 'savings' ? 'e.g. Holiday Fund' : 'e.g. Pay off credit card'
              }
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="goal-target" className="block text-sm font-medium text-text-primary">
              Target amount
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input
                id="goal-target"
                name="target_amount"
                type="number"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-sm font-medium text-text-primary">
              Target date <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <Input id="goal-date" name="target_date" type="date" className="mt-1" />
          </div>

          {goalType === 'financial' && (
            <>
              <div>
                <label htmlFor="goal-debt" className="block text-sm font-medium text-text-primary">
                  Link to debt <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <select
                  id="goal-debt"
                  name="debt_id"
                  className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
                >
                  <option value="">None</option>
                  {debts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="goal-cat" className="block text-sm font-medium text-text-primary">
                  Link to category <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <select
                  id="goal-cat"
                  name="category_id"
                  className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

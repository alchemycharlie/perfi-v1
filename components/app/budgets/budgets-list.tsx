'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { createBudget, deleteBudget, updateBudget } from '@/lib/actions/budgets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

interface BudgetItem {
  id: string;
  amount: number;
  category_id: string;
  category_name: string;
  category_colour: string | null;
  spent: number;
}

interface BudgetsListProps {
  budgets: BudgetItem[];
  workspaceId: string;
  categories: Array<{ id: string; name: string }>;
}

export function BudgetsList({ budgets, workspaceId, categories }: BudgetsListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Categories that don't already have a budget
  const budgetedCategoryIds = new Set(budgets.map((b) => b.category_id));
  const availableCategories = categories.filter((c) => !budgetedCategoryIds.has(c.id));

  async function handleAddBudget(formData: FormData) {
    setAddLoading(true);
    setAddError(null);
    const result = await createBudget(workspaceId, { success: false }, formData);
    setAddLoading(false);
    if (result.success) setShowAdd(false);
    else setAddError(result.error || 'Failed to add budget.');
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => (
        <BudgetBar key={budget.id} budget={budget} />
      ))}

      {/* Add budget */}
      {availableCategories.length > 0 && (
        <>
          {showAdd ? (
            <form
              action={handleAddBudget}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="category_id"
                  required
                  className="h-10 rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 text-sm text-text-primary"
                >
                  <option value="">Select category</option>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">&pound;</span>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="Monthly limit"
                  />
                </div>
              </div>
              <input type="hidden" name="period" value="monthly" />
              {addError && <p className="text-sm text-danger">{addError}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={addLoading}>
                  {addLoading ? 'Adding...' : 'Set budget'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
              + Set budget
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function BudgetBar({ budget }: { budget: BudgetItem }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const percentage = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
  const overBudget = budget.spent > budget.amount;
  const nearLimit = percentage >= 80 && !overBudget;

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    const result = await updateBudget(budget.id, { success: false }, formData);
    setLoading(false);
    if (result.success) setEditing(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteBudget(budget.id);
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {budget.category_colour && (
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: budget.category_colour }}
            />
          )}
          <span className="text-sm font-medium text-text-primary">{budget.category_name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-text-secondary">
            {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
          </span>
          <span
            className={cn(
              'text-xs font-medium tabular-nums',
              overBudget ? 'text-danger' : nearLimit ? 'text-warning' : 'text-text-muted',
            )}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            overBudget ? 'bg-danger' : nearLimit ? 'bg-warning' : 'bg-accent',
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {overBudget && (
        <p className="mt-1 text-xs text-danger">
          {formatCurrency(budget.spent - budget.amount)} over budget
        </p>
      )}

      {/* Edit / Delete */}
      <div className="mt-2 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : 'Edit'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
          Delete
        </Button>
      </div>

      {editing && (
        <form action={handleUpdate} className="mt-2 flex items-center gap-2">
          <span className="text-sm text-text-secondary">&pound;</span>
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={budget.amount}
            className="w-32"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? '...' : 'Save'}
          </Button>
        </form>
      )}
    </div>
  );
}

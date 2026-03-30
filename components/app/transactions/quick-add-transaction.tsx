'use client';

import { useState } from 'react';
import { createTransaction } from '@/lib/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Quick-add transaction slide-out panel.
 * Phase 4 Section 7: Triggered from top bar, opens as slide-out panel.
 * Fields: Amount, Description, Category, Account, Date (today), Type toggle.
 * Submit closes panel and shows toast.
 */
interface QuickAddProps {
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
}

export function QuickAddTransaction({ workspaceId, accounts, categories }: QuickAddProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txnType, setTxnType] = useState<'expense' | 'income'>('expense');

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(formData: FormData) {
    formData.set('type', txnType);
    setLoading(true);
    setError(null);

    const result = await createTransaction(workspaceId, { success: false }, formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      setTxnType('expense');
    } else {
      setError(
        result.error ||
          Object.values(result.errors || {})
            .flat()
            .join(', '),
      );
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        + Transaction
      </Button>
    );
  }

  const filteredCategories = categories.filter((c) => c.type === txnType || c.type === 'transfer');

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-bg-primary shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-lg font-semibold text-text-primary">Add transaction</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-secondary"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form action={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4">
            {/* Type toggle */}
            <div className="flex rounded-[var(--radius-md)] border border-border">
              <button
                type="button"
                onClick={() => setTxnType('expense')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  txnType === 'expense'
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary'
                } rounded-l-[var(--radius-md)]`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTxnType('income')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  txnType === 'income'
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary'
                } rounded-r-[var(--radius-md)]`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="txn-amount" className="block text-sm font-medium text-text-primary">
                Amount
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-text-secondary">&pound;</span>
                <Input
                  id="txn-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  autoFocus
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="txn-desc" className="block text-sm font-medium text-text-primary">
                Description
              </label>
              <Input
                id="txn-desc"
                name="description"
                required
                placeholder="e.g. Tesco, TfL, Salary"
                className="mt-1"
              />
            </div>

            {/* Account */}
            <div>
              <label htmlFor="txn-account" className="block text-sm font-medium text-text-primary">
                Account
              </label>
              <select
                id="txn-account"
                name="account_id"
                required
                className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="txn-category" className="block text-sm font-medium text-text-primary">
                Category
              </label>
              <select
                id="txn-category"
                name="category_id"
                className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Uncategorised</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="txn-date" className="block text-sm font-medium text-text-primary">
                Date
              </label>
              <Input
                id="txn-date"
                name="date"
                type="date"
                required
                defaultValue={today}
                className="mt-1"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="txn-notes" className="block text-sm font-medium text-text-primary">
                Notes <span className="font-normal text-text-muted">(optional)</span>
              </label>
              <Input id="txn-notes" name="notes" placeholder="Optional notes" className="mt-1" />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add transaction'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

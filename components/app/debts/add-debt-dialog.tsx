'use client';

import { useState } from 'react';
import { createDebt } from '@/lib/actions/debts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
}

export function AddDebtDialog({ workspaceId, accounts }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createDebt(workspaceId, { success: false }, formData);
    setLoading(false);
    if (result.success) setOpen(false);
    else setError(result.error || 'Failed to add debt.');
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Add debt
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Add debt</h2>

        <form action={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="debt-name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              id="debt-name"
              name="name"
              required
              placeholder="e.g. Tesco Credit Card, Student Loan"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="debt-balance" className="block text-sm font-medium text-text-primary">
              Current balance
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input
                id="debt-balance"
                name="balance"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="debt-min-payment"
              className="block text-sm font-medium text-text-primary"
            >
              Minimum monthly payment
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input
                id="debt-min-payment"
                name="minimum_payment"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="debt-apr" className="block text-sm font-medium text-text-primary">
              Annual interest rate (APR){' '}
              <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="debt-apr"
                name="interest_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 19.9"
              />
              <span className="text-sm text-text-secondary">%</span>
            </div>
          </div>

          <div>
            <label htmlFor="debt-next-pay" className="block text-sm font-medium text-text-primary">
              Next payment date <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <Input id="debt-next-pay" name="next_payment_date" type="date" className="mt-1" />
          </div>

          <div>
            <label htmlFor="debt-account" className="block text-sm font-medium text-text-primary">
              Linked account <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <select
              id="debt-account"
              name="account_id"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              <option value="">None</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add debt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

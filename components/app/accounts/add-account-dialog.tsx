'use client';

import { useState } from 'react';
import { createAccount } from '@/lib/actions/accounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const accountTypes = [
  { value: 'current', label: 'Current account' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investments', label: 'Investments' },
];

export function AddAccountDialog({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createAccount(workspaceId, { success: false }, formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || 'Failed to create account.');
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Add account
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Add account</h2>

        <form action={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-text-primary">
              Account name
            </label>
            <Input
              id="account-name"
              name="name"
              required
              placeholder="e.g. Barclays Current"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="account-type" className="block text-sm font-medium text-text-primary">
              Type
            </label>
            <select
              id="account-type"
              name="type"
              defaultValue="current"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              {accountTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="account-balance"
              className="block text-sm font-medium text-text-primary"
            >
              Starting balance
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input
                id="account-balance"
                name="balance"
                type="number"
                step="0.01"
                defaultValue="0"
                className="flex-1"
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createBill } from '@/lib/actions/bills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export function AddBillDialog({ workspaceId, accounts, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createBill(workspaceId, { success: false }, formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || 'Failed to add bill.');
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Add bill
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Add bill</h2>

        <form action={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="bill-name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              id="bill-name"
              name="name"
              required
              placeholder="e.g. Netflix, Council Tax"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="bill-amount" className="block text-sm font-medium text-text-primary">
              Amount
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input id="bill-amount" name="amount" type="number" step="0.01" min="0.01" required />
            </div>
          </div>

          <div>
            <label htmlFor="bill-freq" className="block text-sm font-medium text-text-primary">
              Frequency
            </label>
            <select
              id="bill-freq"
              name="frequency"
              defaultValue="monthly"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="four_weekly">Every 4 weeks</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div>
            <label htmlFor="bill-due" className="block text-sm font-medium text-text-primary">
              Next due date
            </label>
            <Input id="bill-due" name="next_due_date" type="date" required className="mt-1" />
          </div>

          <div>
            <label htmlFor="bill-method" className="block text-sm font-medium text-text-primary">
              Payment method
            </label>
            <select
              id="bill-method"
              name="payment_method"
              defaultValue="direct_debit"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              <option value="direct_debit">Direct debit</option>
              <option value="standing_order">Standing order</option>
              <option value="card">Card</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label htmlFor="bill-account" className="block text-sm font-medium text-text-primary">
              Paid from <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <select
              id="bill-account"
              name="account_id"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              <option value="">Not specified</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bill-category" className="block text-sm font-medium text-text-primary">
              Category <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <select
              id="bill-category"
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

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_subscription"
              value="true"
              className="h-4 w-4 rounded border-border text-accent"
            />
            <span className="text-sm text-text-primary">This is a subscription</span>
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add bill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

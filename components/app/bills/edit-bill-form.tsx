'use client';

import { useState } from 'react';
import { updateBill } from '@/lib/actions/bills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  billId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  initial: {
    name: string;
    amount: number;
    frequency: string;
    next_due_date: string;
    payment_method: string;
    account_id: string;
    category_id: string;
    is_subscription: boolean;
    notes: string;
  };
  onClose: () => void;
}

export function EditBillForm({ billId, accounts, categories, initial, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updateBill(billId, { success: false }, formData);
    setLoading(false);
    if (result.success) onClose();
    else setError(result.error || 'Failed to update.');
  }

  return (
    <form
      action={handleSubmit}
      className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border bg-bg-secondary p-4"
    >
      <Input name="name" required defaultValue={initial.name} placeholder="Bill name" />
      <div className="grid grid-cols-2 gap-2">
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={initial.amount}
        />
        <select
          name="frequency"
          defaultValue={initial.frequency}
          className="h-9 rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
        >
          <option value="weekly">Weekly</option>
          <option value="fortnightly">Fortnightly</option>
          <option value="four_weekly">Every 4 weeks</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input name="next_due_date" type="date" required defaultValue={initial.next_due_date} />
        <select
          name="payment_method"
          defaultValue={initial.payment_method}
          className="h-9 rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
        >
          <option value="direct_debit">Direct debit</option>
          <option value="standing_order">Standing order</option>
          <option value="card">Card</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          name="account_id"
          defaultValue={initial.account_id}
          className="h-9 rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
        >
          <option value="">Not specified</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          name="category_id"
          defaultValue={initial.category_id}
          className="h-9 rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
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
          defaultChecked={initial.is_subscription}
          className="h-4 w-4 rounded border-border text-accent"
        />
        <span className="text-sm text-text-primary">Subscription</span>
      </label>
      <Input name="notes" defaultValue={initial.notes} placeholder="Notes (optional)" />
      {error && <p className="text-xs text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

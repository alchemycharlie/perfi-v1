'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { updateDebt, deleteDebt } from '@/lib/actions/debts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface DebtCardProps {
  debt: {
    id: string;
    name: string;
    balance: number;
    minimum_payment: number;
    interest_rate: number | null;
    next_payment_date: string | null;
    account_id: string | null;
    account: { name: string } | null;
    linked_goal: { id: string; name: string } | null;
  };
  accounts: Array<{ id: string; name: string }>;
  workspaceId: string;
}

export function DebtCard({ debt, accounts }: DebtCardProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updateDebt(debt.id, { success: false }, formData);
    setLoading(false);
    if (result.success) setEditing(false);
    else setError(result.error || 'Failed to update.');
  }

  async function handleDelete() {
    setLoading(true);
    await deleteDebt(debt.id);
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-text-primary">{debt.name}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </div>

      <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">
        {formatCurrency(debt.balance)}
      </p>

      <div className="mt-2 space-y-1 text-sm text-text-muted">
        <p>Min payment: {formatCurrency(debt.minimum_payment)}/month</p>
        {debt.interest_rate != null && <p>Interest: {debt.interest_rate}% APR</p>}
        {debt.next_payment_date && <p>Next payment: {debt.next_payment_date}</p>}
        {debt.account && <p>Account: {debt.account.name}</p>}
        {debt.linked_goal && (
          <p>
            Linked to goal:{' '}
            <Link
              href={`/app/goals/${debt.linked_goal.id}`}
              className="text-accent hover:text-accent-hover"
            >
              {debt.linked_goal.name}
            </Link>
          </p>
        )}
      </div>

      {editing && (
        <form
          action={handleUpdate}
          className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border bg-bg-secondary p-3"
        >
          <Input name="name" required defaultValue={debt.name} placeholder="Debt name" />
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="balance"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={debt.balance}
              placeholder="Balance"
            />
            <Input
              name="minimum_payment"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={debt.minimum_payment}
              placeholder="Min payment"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="interest_rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue={debt.interest_rate ?? ''}
              placeholder="APR %"
            />
            <Input
              name="next_payment_date"
              type="date"
              defaultValue={debt.next_payment_date ?? ''}
            />
          </div>
          <select
            name="account_id"
            defaultValue={debt.account_id ?? ''}
            className="h-9 w-full rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
          >
            <option value="">No linked account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </form>
      )}
    </div>
  );
}

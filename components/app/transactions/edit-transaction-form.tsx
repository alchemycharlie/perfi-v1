'use client';

import { useState } from 'react';
import { updateTransaction } from '@/lib/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditTransactionFormProps {
  transactionId: string;
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
  initial: {
    account_id: string;
    category_id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    notes: string;
  };
  onClose: () => void;
}

export function EditTransactionForm({
  transactionId,
  workspaceId,
  accounts,
  categories,
  initial,
  onClose,
}: EditTransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txnType, setTxnType] = useState(initial.type);

  const filteredCategories = categories.filter((c) => c.type === txnType || c.type === 'transfer');

  async function handleSubmit(formData: FormData) {
    formData.set('type', txnType);
    setLoading(true);
    setError(null);
    const result = await updateTransaction(
      transactionId,
      workspaceId,
      { success: false },
      formData,
    );
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to update transaction.');
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTxnType('expense')}
          className={`flex-1 rounded-[var(--radius-sm)] py-1.5 text-xs font-medium ${txnType === 'expense' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setTxnType('income')}
          className={`flex-1 rounded-[var(--radius-sm)] py-1.5 text-xs font-medium ${txnType === 'income' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={initial.amount}
            placeholder="Amount"
          />
        </div>
        <div>
          <Input name="date" type="date" required defaultValue={initial.date} />
        </div>
      </div>

      <Input
        name="description"
        required
        defaultValue={initial.description}
        placeholder="Description"
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          name="account_id"
          required
          defaultValue={initial.account_id}
          className="h-9 rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
        >
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
          <option value="">Uncategorised</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

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

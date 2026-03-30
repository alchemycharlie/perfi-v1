'use client';

import { useState } from 'react';
import { updateAccount } from '@/lib/actions/accounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const accountTypes = [
  { value: 'current', label: 'Current account' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investments', label: 'Investments' },
];

interface EditAccountFormProps {
  accountId: string;
  initialName: string;
  initialType: string;
}

export function EditAccountForm({ accountId, initialName, initialType }: EditAccountFormProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updateAccount(accountId, { success: false }, formData);
    setLoading(false);

    if (result.success) {
      setEditing(false);
    } else {
      setError(result.error || 'Failed to update account.');
    }
  }

  if (!editing) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        Edit
      </Button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="mt-4 space-y-3 rounded-[var(--radius-md)] border border-border bg-bg-secondary p-4"
    >
      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium text-text-primary">
          Name
        </label>
        <Input id="edit-name" name="name" required defaultValue={initialName} className="mt-1" />
      </div>
      <div>
        <label htmlFor="edit-type" className="block text-sm font-medium text-text-primary">
          Type
        </label>
        <select
          id="edit-type"
          name="type"
          defaultValue={initialType}
          className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
        >
          {accountTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      {/* balance is hidden — managed by transaction trigger, not editable */}
      <input type="hidden" name="balance" value="0" />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

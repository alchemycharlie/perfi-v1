'use client';

import { useState } from 'react';
import { updateIncomeSource } from '@/lib/actions/income';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const benefitTypes = [
  { value: 'universal_credit', label: 'Universal Credit' },
  { value: 'pip', label: 'PIP' },
  { value: 'child_benefit', label: 'Child Benefit' },
  { value: 'carers_allowance', label: "Carer's Allowance" },
  { value: 'esa', label: 'ESA' },
  { value: 'housing_benefit', label: 'Housing Benefit' },
  { value: 'council_tax_reduction', label: 'Council Tax Reduction' },
  { value: 'other', label: 'Other' },
];

interface Props {
  sourceId: string;
  accounts: Array<{ id: string; name: string }>;
  initial: {
    name: string;
    type: string;
    benefit_type: string;
    amount: number;
    frequency: string;
    next_pay_date: string;
    account_id: string;
  };
  onClose: () => void;
}

export function EditIncomeForm({ sourceId, accounts, initial, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeType, setIncomeType] = useState(initial.type);

  async function handleSubmit(formData: FormData) {
    formData.set('type', incomeType);
    setLoading(true);
    setError(null);
    const result = await updateIncomeSource(sourceId, { success: false }, formData);
    setLoading(false);
    if (result.success) onClose();
    else setError(result.error || 'Failed to update.');
  }

  return (
    <form
      action={handleSubmit}
      className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-border bg-bg-secondary p-4"
    >
      <div className="flex gap-2">
        {(['employment', 'benefit', 'other'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setIncomeType(t)}
            className={`flex-1 rounded-[var(--radius-sm)] py-1.5 text-xs font-medium ${incomeType === t ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
          >
            {t === 'employment' ? 'Employment' : t === 'benefit' ? 'Benefit' : 'Other'}
          </button>
        ))}
      </div>
      <Input name="name" required defaultValue={initial.name} placeholder="Name" />
      {incomeType === 'benefit' && (
        <select
          name="benefit_type"
          defaultValue={initial.benefit_type}
          className="h-9 w-full rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
        >
          {benefitTypes.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      )}
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
        </select>
      </div>
      <Input name="next_pay_date" type="date" required defaultValue={initial.next_pay_date} />
      <select
        name="account_id"
        defaultValue={initial.account_id}
        className="h-9 w-full rounded-[var(--radius-sm)] border border-border bg-bg-primary px-2 text-sm text-text-primary"
      >
        <option value="">Not specified</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
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

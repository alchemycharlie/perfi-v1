'use client';

import { useState } from 'react';
import { createIncomeSource } from '@/lib/actions/income';
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
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
}

export function AddIncomeSourceDialog({ workspaceId, accounts }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeType, setIncomeType] = useState<'employment' | 'benefit' | 'other'>('employment');

  async function handleSubmit(formData: FormData) {
    formData.set('type', incomeType);
    setLoading(true);
    setError(null);
    const result = await createIncomeSource(workspaceId, { success: false }, formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      setIncomeType('employment');
    } else {
      setError(result.error || 'Failed to add income source.');
    }
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Add income source
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Add income source</h2>

        <form action={handleSubmit} className="mt-4 space-y-4">
          {/* Type selector */}
          <div className="flex rounded-[var(--radius-md)] border border-border">
            {(['employment', 'benefit', 'other'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setIncomeType(t)}
                className={`flex-1 py-2 text-sm font-medium transition-colors first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)] ${
                  incomeType === t
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t === 'employment' ? 'Employment' : t === 'benefit' ? 'Benefit' : 'Other'}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="income-name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              id="income-name"
              name="name"
              required
              placeholder={
                incomeType === 'benefit' ? 'e.g. Universal Credit' : 'e.g. Salary — Acme Ltd'
              }
              className="mt-1"
            />
          </div>

          {incomeType === 'benefit' && (
            <div>
              <label
                htmlFor="income-benefit-type"
                className="block text-sm font-medium text-text-primary"
              >
                Benefit type
              </label>
              <select
                id="income-benefit-type"
                name="benefit_type"
                className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
              >
                {benefitTypes.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="income-amount" className="block text-sm font-medium text-text-primary">
              Amount
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-text-secondary">&pound;</span>
              <Input
                id="income-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="income-freq" className="block text-sm font-medium text-text-primary">
              How often
            </label>
            <select
              id="income-freq"
              name="frequency"
              defaultValue="monthly"
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="four_weekly">Every 4 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="income-pay-date"
              className="block text-sm font-medium text-text-primary"
            >
              Next pay date
            </label>
            <Input
              id="income-pay-date"
              name="next_pay_date"
              type="date"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="income-account" className="block text-sm font-medium text-text-primary">
              Pays into <span className="font-normal text-text-muted">(optional)</span>
            </label>
            <select
              id="income-account"
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

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add income source'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

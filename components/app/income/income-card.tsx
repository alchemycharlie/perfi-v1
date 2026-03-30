'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { DeleteIncomeButton } from '@/components/app/income/delete-income-button';
import { EditIncomeForm } from '@/components/app/income/edit-income-form';
import { Button } from '@/components/ui/button';

const typeLabels: Record<string, string> = {
  employment: 'Employment',
  benefit: 'Benefit',
  other: 'Other',
};

const frequencyLabels: Record<string, string> = {
  weekly: '/week',
  fortnightly: '/fortnight',
  four_weekly: '/4 weeks',
  monthly: '/month',
};

const benefitLabels: Record<string, string> = {
  universal_credit: 'Universal Credit',
  pip: 'PIP',
  child_benefit: 'Child Benefit',
  carers_allowance: "Carer's Allowance",
  esa: 'ESA',
  housing_benefit: 'Housing Benefit',
  council_tax_reduction: 'Council Tax Reduction',
  other: 'Other',
};

interface IncomeCardProps {
  source: {
    id: string;
    name: string;
    type: string;
    benefit_type: string | null;
    amount: number;
    frequency: string;
    next_pay_date: string;
    account_id: string | null;
    account: { name: string } | null;
  };
  accounts: Array<{ id: string; name: string }>;
}

export function IncomeCard({ source, accounts }: IncomeCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-text-primary">{source.name}</h3>
            <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary">
              {typeLabels[source.type]}
            </span>
            {source.type === 'benefit' && source.benefit_type && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                {benefitLabels[source.benefit_type] || source.benefit_type}
              </span>
            )}
          </div>
          <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
            {formatCurrency(source.amount)}
            <span className="text-sm font-normal text-text-muted">
              {frequencyLabels[source.frequency]}
            </span>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Next: {source.next_pay_date}
            {source.account && <> &middot; Pays into: {source.account.name}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <DeleteIncomeButton sourceId={source.id} sourceName={source.name} />
        </div>
      </div>

      {editing && (
        <EditIncomeForm
          sourceId={source.id}
          accounts={accounts}
          initial={{
            name: source.name,
            type: source.type,
            benefit_type: source.benefit_type || '',
            amount: source.amount,
            frequency: source.frequency,
            next_pay_date: source.next_pay_date,
            account_id: source.account_id || '',
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}

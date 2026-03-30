'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { DeleteBillButton } from '@/components/app/bills/delete-bill-button';
import { EditBillForm } from '@/components/app/bills/edit-bill-form';
import { Button } from '@/components/ui/button';

const frequencyLabels: Record<string, string> = {
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  four_weekly: 'Every 4 weeks',
  monthly: 'Monthly',
  annually: 'Annually',
};

const paymentMethodLabels: Record<string, string> = {
  direct_debit: 'Direct debit',
  standing_order: 'Standing order',
  card: 'Card',
  manual: 'Manual',
};

interface BillRowProps {
  bill: {
    id: string;
    name: string;
    amount: number;
    frequency: string;
    next_due_date: string;
    payment_method: string;
    account_id: string | null;
    category_id: string | null;
    is_subscription: boolean;
    notes: string | null;
    account: { name: string } | null;
  };
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export function BillRow({ bill, accounts, categories }: BillRowProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">{bill.name}</p>
            {bill.is_subscription && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Sub</span>
            )}
          </div>
          <p className="text-xs text-text-muted">
            {frequencyLabels[bill.frequency]} &middot; {paymentMethodLabels[bill.payment_method]}{' '}
            &middot; Next: {bill.next_due_date}
            {bill.account && <> &middot; {bill.account.name}</>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tabular-nums text-text-primary">
            {formatCurrency(bill.amount)}
          </span>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <DeleteBillButton billId={bill.id} billName={bill.name} />
        </div>
      </div>

      {editing && (
        <EditBillForm
          billId={bill.id}
          accounts={accounts}
          categories={categories}
          initial={{
            name: bill.name,
            amount: bill.amount,
            frequency: bill.frequency,
            next_due_date: bill.next_due_date,
            payment_method: bill.payment_method,
            account_id: bill.account_id || '',
            category_id: bill.category_id || '',
            is_subscription: bill.is_subscription,
            notes: bill.notes || '',
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}

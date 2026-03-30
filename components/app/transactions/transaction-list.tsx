'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { deleteTransaction } from '@/lib/actions/transactions';
import { Button } from '@/components/ui/button';
import { EditTransactionForm } from '@/components/app/transactions/edit-transaction-form';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  notes: string | null;
  account: { id: string; name: string } | null;
  category: { id: string; name: string; colour: string | null } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
}

export function TransactionList({
  transactions,
  workspaceId,
  accounts,
  categories,
}: TransactionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group transactions by date
  const grouped = groupByDate(transactions);

  return (
    <div className="space-y-6">
      {grouped.map(([dateLabel, txns]) => (
        <div key={dateLabel}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {dateLabel}
          </h3>
          <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
            {txns.map((txn) => (
              <TransactionRow
                key={txn.id}
                transaction={txn}
                workspaceId={workspaceId}
                accounts={accounts}
                categories={categories}
                expanded={expandedId === txn.id}
                onToggle={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionRow({
  transaction,
  expanded,
  onToggle,
  workspaceId,
  accounts,
  categories,
}: {
  transaction: Transaction;
  expanded: boolean;
  onToggle: () => void;
  workspaceId: string;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteTransaction(transaction.id);
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-bg-secondary"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {transaction.category?.colour && (
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: transaction.category.colour }}
              />
            )}
            <p className="truncate text-sm font-medium text-text-primary">
              {transaction.description}
            </p>
          </div>
          <p className="text-xs text-text-muted">
            {transaction.category?.name || 'Uncategorised'}
            {transaction.account && <> &middot; {transaction.account.name}</>}
          </p>
        </div>
        <span
          className={`shrink-0 text-sm font-medium tabular-nums ${
            transaction.type === 'income' ? 'text-success' : 'text-text-primary'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </button>

      {/* Progressive disclosure: expanded row details */}
      {expanded && (
        <div className="border-t border-border bg-bg-secondary px-4 py-3">
          {editMode ? (
            <EditTransactionForm
              transactionId={transaction.id}
              workspaceId={workspaceId}
              accounts={accounts}
              categories={categories}
              initial={{
                account_id: transaction.account?.id || '',
                category_id: transaction.category?.id || '',
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date,
                notes: transaction.notes || '',
              }}
              onClose={() => setEditMode(false)}
            />
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-1 text-sm">
                {transaction.notes && (
                  <p className="text-text-secondary">
                    <span className="font-medium text-text-primary">Notes:</span>{' '}
                    {transaction.notes}
                  </p>
                )}
                <p className="text-text-muted">Date: {transaction.date}</p>
                {transaction.account && (
                  <p className="text-text-muted">Account: {transaction.account.name}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function groupByDate(transactions: Transaction[]): [string, Transaction[]][] {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const groups = new Map<string, Transaction[]>();

  for (const txn of transactions) {
    let label = txn.date;
    if (txn.date === today) label = 'Today';
    else if (txn.date === yesterday) label = 'Yesterday';

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(txn);
  }

  return Array.from(groups.entries());
}

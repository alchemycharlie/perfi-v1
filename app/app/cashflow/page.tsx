import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/shared/empty-state';
import { CashflowCalendar } from '@/components/app/cashflow/cashflow-calendar';
import { getOccurrencesInRange, getMonthRange, toDateString } from '@/lib/utils/dates';
import type { Frequency } from '@/lib/utils/dates';

/**
 * Cashflow page — Server Component.
 * Fetches income sources, bills, and transactions, then projects events
 * onto the current month's calendar.
 */
export default async function CashflowPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership) return null;
  const workspaceId = membership.workspace_id;

  // Fetch data
  const [incomeResult, billsResult, accountsResult] = await Promise.all([
    supabase
      .from('income_sources')
      .select('name, amount, frequency, next_pay_date')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true),
    supabase
      .from('bills')
      .select('name, amount, frequency, next_due_date, payment_method')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true),
    supabase
      .from('accounts')
      .select('balance')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true),
  ]);

  const incomeSources = incomeResult.data || [];
  const bills = billsResult.data || [];
  const accounts = accountsResult.data || [];

  if (incomeSources.length === 0 && bills.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Cashflow</h1>
        <EmptyState
          title="Not enough data yet"
          description="Add some accounts, income sources, and bills to see your cashflow calendar."
          actionLabel="Add income source"
          actionHref="/app/income"
        />
      </div>
    );
  }

  // Project events for current month
  const now = new Date();
  const { start, end } = getMonthRange(now.getFullYear(), now.getMonth());

  interface CalendarEvent {
    date: string;
    name: string;
    amount: number;
    type: 'income' | 'bill';
    method?: string;
  }

  const events: CalendarEvent[] = [];

  // Income events
  for (const source of incomeSources) {
    const dates = getOccurrencesInRange(
      new Date(source.next_pay_date),
      source.frequency as Frequency,
      start,
      end,
    );
    for (const d of dates) {
      events.push({
        date: toDateString(d),
        name: source.name,
        amount: source.amount,
        type: 'income',
      });
    }
  }

  // Bill events
  for (const bill of bills) {
    const dates = getOccurrencesInRange(
      new Date(bill.next_due_date),
      bill.frequency as Frequency,
      start,
      end,
    );
    for (const d of dates) {
      events.push({
        date: toDateString(d),
        name: bill.name,
        amount: bill.amount,
        type: 'bill',
        method: bill.payment_method,
      });
    }
  }

  const currentBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Cashflow</h1>
      <CashflowCalendar
        events={events}
        year={now.getFullYear()}
        month={now.getMonth()}
        currentBalance={currentBalance}
      />
    </div>
  );
}

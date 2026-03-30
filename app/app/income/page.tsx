import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { AddIncomeSourceDialog } from '@/components/app/income/add-income-dialog';
import { DeleteIncomeButton } from '@/components/app/income/delete-income-button';

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

export default async function IncomePage() {
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

  const { data: sources } = await supabase
    .from('income_sources')
    .select('*, account:accounts(name)')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('created_at');

  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name');

  const sourceList = (sources || []).map((s) => ({
    ...s,
    account: Array.isArray(s.account) ? s.account[0] || null : s.account,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Income</h1>
        <AddIncomeSourceDialog workspaceId={workspaceId} accounts={accounts || []} />
      </div>

      {sourceList.length === 0 ? (
        <EmptyState
          title="No income sources"
          description="Add your employment income, benefits, or other income to see your full financial picture."
        />
      ) : (
        <div className="space-y-4">
          {sourceList.map((source) => (
            <div
              key={source.id}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4"
            >
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
                    {source.account && (
                      <> &middot; Pays into: {(source.account as { name: string }).name}</>
                    )}
                  </p>
                </div>
                <DeleteIncomeButton sourceId={source.id} sourceName={source.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

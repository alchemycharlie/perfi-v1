import { createClient } from '@/lib/supabase/server';
import { BillingContent } from '@/components/app/settings/billing-content';

/**
 * Billing page — Server Component.
 * Phase 4 Section 17.5: Shows plan state + actions.
 */
export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end, cancel_at_period_end')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Subscription &amp; Billing</h1>
      <BillingContent
        plan={subscription?.plan || 'free'}
        status={subscription?.status || 'active'}
        periodEnd={subscription?.current_period_end || null}
        cancelAtPeriodEnd={subscription?.cancel_at_period_end || false}
      />
    </div>
  );
}

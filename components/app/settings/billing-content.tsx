'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
} from '@/lib/actions/billing';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

interface BillingContentProps {
  plan: string;
  status: string;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

function BillingInner({ plan, status, periodEnd, cancelAtPeriodEnd }: BillingContentProps) {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [loading, setLoading] = useState(false);

  const isPro = plan === 'pro';
  const formattedPeriodEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  async function handleAction(action: () => Promise<unknown>) {
    setLoading(true);
    try {
      await action();
    } catch {
      // redirect actions throw NEXT_REDIRECT
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl space-y-6">
      {success && (
        <div className="rounded-[var(--radius-md)] border border-accent/20 bg-accent/5 p-4 text-sm text-accent">
          Welcome to Pro! Your subscription is now active.
        </div>
      )}

      {/* Free plan */}
      {!isPro && (
        <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">You&apos;re on the Free plan</h2>
          <p className="text-sm text-text-secondary">
            Upgrade to Pro to unlock unlimited accounts, budgets, and goals, plus advanced
            analytics, cashflow forecasting, and more.
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>Pro includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited accounts, budgets, and goals</li>
              <li>Up to 5 workspaces</li>
              <li>Advanced analytics and trends</li>
              <li>Net worth tracking</li>
              <li>Cashflow forecasting</li>
              <li>CSV import and full export</li>
            </ul>
          </div>
          <form action={() => handleAction(createCheckoutSession)}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Upgrade to Pro — £4.99/month'}
            </Button>
          </form>
        </section>
      )}

      {/* Pro plan — active */}
      {isPro && status === 'active' && !cancelAtPeriodEnd && (
        <section className="rounded-[var(--radius-lg)] border border-accent/20 bg-accent/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">You&apos;re on Pro</h2>
          <p className="text-sm text-text-secondary">
            Next billing date: {formattedPeriodEnd || 'Unknown'}
          </p>
          <div className="flex gap-3">
            <form action={() => handleAction(createPortalSession)}>
              <Button type="submit" variant="outline" size="sm" disabled={loading}>
                Manage payment method
              </Button>
            </form>
            <form action={() => handleAction(cancelSubscription)}>
              <Button type="submit" variant="ghost" size="sm" disabled={loading}>
                Cancel subscription
              </Button>
            </form>
          </div>
        </section>
      )}

      {/* Pro plan — cancelling */}
      {isPro && cancelAtPeriodEnd && (
        <section className="rounded-[var(--radius-lg)] border border-warning/20 bg-warning/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Your Pro plan is ending</h2>
          <p className="text-sm text-text-secondary">
            Your Pro plan ends on {formattedPeriodEnd || 'your next billing date'}. You&apos;ll keep
            access until then.
          </p>
          <form action={() => handleAction(resumeSubscription)}>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Loading...' : 'Resume subscription'}
            </Button>
          </form>
        </section>
      )}

      {/* Pro plan — past due */}
      {isPro && status === 'past_due' && (
        <section className="rounded-[var(--radius-lg)] border border-danger/20 bg-danger/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Payment failed</h2>
          <p className="text-sm text-text-secondary">
            Your payment failed. Please update your payment method to keep Pro access.
          </p>
          <form action={() => handleAction(createPortalSession)}>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Loading...' : 'Update payment method'}
            </Button>
          </form>
        </section>
      )}
    </div>
  );
}

export function BillingContent(props: BillingContentProps) {
  return (
    <Suspense>
      <BillingInner {...props} />
    </Suspense>
  );
}

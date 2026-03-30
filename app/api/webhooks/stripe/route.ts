import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

/**
 * Stripe webhook handler.
 * Phase 3 Section 14 — handles 5 events:
 *   checkout.session.completed
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.payment_failed
 *   invoice.paid
 *
 * Uses service_role client (bypasses RLS) to update subscription records.
 * Signature-verified on every request.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.metadata?.supabase_user_id ||
          (session.subscription && typeof session.subscription === 'object'
            ? (session.subscription as Stripe.Subscription).metadata?.supabase_user_id
            : null);

        if (!userId) break;

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : (session.subscription as Stripe.Subscription)?.id;

        if (subscriptionId) {
          // Retrieve subscription and extract period dates
          const stripeSubscription = (await stripe.subscriptions.retrieve(
            subscriptionId,
          )) as unknown as Record<string, unknown>;
          const periodStart =
            typeof stripeSubscription.current_period_start === 'number'
              ? new Date(stripeSubscription.current_period_start * 1000).toISOString()
              : null;
          const periodEnd =
            typeof stripeSubscription.current_period_end === 'number'
              ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
              : null;

          await supabase
            .from('subscriptions')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscriptionId,
              plan: 'pro',
              status: 'active',
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: false,
            })
            .eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as unknown as Record<string, unknown>;
        const metadata = sub.metadata as Record<string, string> | undefined;
        const userId = metadata?.supabase_user_id;
        if (!userId) break;

        const status = mapStripeStatus(sub.status as Stripe.Subscription.Status);
        const periodStart =
          typeof sub.current_period_start === 'number'
            ? new Date(sub.current_period_start * 1000).toISOString()
            : null;
        const periodEnd =
          typeof sub.current_period_end === 'number'
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null;

        await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: Boolean(sub.cancel_at_period_end),
          })
          .eq('user_id', userId);
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as unknown as Record<string, unknown>;
        const deletedMeta = deletedSub.metadata as Record<string, string> | undefined;
        const userId = deletedMeta?.supabase_user_id;
        if (!userId) break;

        // Downgrade to free — data preserved, Pro features become inaccessible
        await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'expired',
            stripe_subscription_id: null,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Only update if was past_due (don't override other statuses)
        await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('stripe_customer_id', customerId)
          .eq('status', 'past_due');
        break;
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'canceled':
      return 'cancelled';
    case 'past_due':
    case 'unpaid':
      return 'past_due';
    default:
      return 'expired';
  }
}

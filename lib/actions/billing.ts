'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { stripe, STRIPE_PRO_PRICE_ID } from '@/lib/stripe/config';
import type { ActionResult } from '@/lib/actions/utils';

/**
 * Create a Stripe Checkout Session for upgrading to Pro.
 * Phase 3 Section 14: User upgrades → Stripe Checkout creates customer + subscription.
 */
export async function createCheckoutSession(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  // Get or create Stripe customer
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from('subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  if (!session.url) {
    return { success: false, error: 'Failed to create checkout session.' };
  }

  redirect(session.url);
}

/**
 * Create a Stripe Customer Portal session for managing payment methods.
 */
export async function createPortalSession(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return { success: false, error: 'No Stripe customer found.' };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing`,
  });

  redirect(session.url);
}

/**
 * Cancel the current subscription at period end.
 */
export async function cancelSubscription(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.stripe_subscription_id) {
    return { success: false, error: 'No active subscription.' };
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  // Webhook will update the database, but set flag optimistically
  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('user_id', user.id);

  return { success: true };
}

/**
 * Resume a subscription that was set to cancel at period end.
 */
export async function resumeSubscription(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.stripe_subscription_id) {
    return { success: false, error: 'No active subscription.' };
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
  });

  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: false })
    .eq('user_id', user.id);

  return { success: true };
}

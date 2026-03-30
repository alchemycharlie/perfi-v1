import Stripe from 'stripe';

/**
 * Stripe server-side client.
 * Used in Server Actions and API routes only — never in Client Components.
 *
 * Phase 3 Section 12 / Final Master Plan — Stripe Integration:
 * - Free users: no Stripe interaction
 * - Upgrade: Server Action creates Checkout Session
 * - Webhook handler: /api/webhooks/stripe handles 5 events
 * - Cancel: Server Action sets cancel_at_period_end
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
});

/**
 * Stripe price ID for the Pro plan (£4.99/month).
 * Set in environment variables to support test/live mode switching.
 */
export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

import { NextResponse } from 'next/server';

/**
 * Stripe webhook handler.
 * Phase E: Handles checkout.session.completed, customer.subscription.updated,
 * customer.subscription.deleted, invoice.payment_failed, invoice.paid
 */
export async function POST() {
  // Placeholder — Stripe webhook handler coming in Phase E
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { waitlistSchema } from '@/lib/validations/schemas';

/**
 * Public waitlist form submission endpoint.
 * Phase 4 Section 16: Client validation → POST → Zod → Insert via service_role.
 * Honeypot anti-spam: reject if "company" field is filled.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.company) {
      // Bot detected — return success silently
      return NextResponse.json({ success: true });
    }

    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('waitlist_entries').insert({
      email: parsed.data.email,
      interests: Array.isArray(body.interests) ? body.interests : null,
      status: 'pending',
    });

    if (error) {
      // Duplicate email — return success silently (don't reveal existing emails)
      if (error.code === '23505') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { contactSchema } from '@/lib/validations/schemas';

/**
 * Public contact form submission endpoint.
 * Phase 4 Section 16: Client validation → POST → Zod → Insert via service_role.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('contact_submissions').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      status: 'new',
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

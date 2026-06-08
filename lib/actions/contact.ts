'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { notifyContactSubmission } from '@/lib/email/notify-contact';
import type { ActionResult } from '@/lib/types';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Valid email is required').max(254),
  subject: z.string().trim().min(1, 'Subject is required').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

export async function submitContactForm(input: ContactFormInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid form data' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    console.error('[submitContactForm]', error.code, error.message);
    return { error: 'Could not send your message. Please email us directly.' };
  }

  try {
    await notifyContactSubmission(parsed.data);
  } catch (err) {
    console.error('[submitContactForm] email notify failed:', err);
  }

  return { success: true };
}

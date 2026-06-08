import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { WebhookEvent } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  let event: WebhookEvent;

  try {
    event = await verifyWebhook(req);
  } catch (err) {
    console.error('Clerk webhook verification failed:', err);
    return new Response('Verification failed', { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url, public_metadata } = event.data;
        const email = email_addresses[0]?.email_address ?? '';
        const meta = public_metadata as { role?: 'student' | 'business' | 'admin'; onboardingComplete?: boolean };

        const profileRow: Record<string, unknown> = {
          id,
          email,
          first_name: first_name ?? null,
          last_name: last_name ?? null,
          avatar_url: image_url ?? null,
          onboarding_complete: meta?.onboardingComplete ?? false,
        };

        // Role is set only by setUserRole() after explicit user selection.
        if (meta?.role) {
          profileRow.role = meta.role;
        }

        const { error } = await supabase.from('profiles').upsert(profileRow);
        if (error) throw error;
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url, public_metadata } = event.data;
        const email = email_addresses[0]?.email_address;
        const meta = public_metadata as {
          role?: 'student' | 'business' | 'admin';
          suspended?: boolean;
          onboardingComplete?: boolean;
        };

        const update: Record<string, unknown> = {
          ...(email ? { email } : {}),
          first_name: first_name ?? null,
          last_name: last_name ?? null,
          avatar_url: image_url ?? null,
        };

        if (meta?.role !== undefined) update.role = meta.role;
        if (meta?.suspended !== undefined) update.suspended = meta.suspended;
        if (meta?.onboardingComplete !== undefined) update.onboarding_complete = meta.onboardingComplete;

        const { error } = await supabase.from('profiles').update(update).eq('id', id);
        if (error) throw error;
        break;
      }

      case 'user.deleted': {
        const id = event.data.id;
        if (id) {
          const { error } = await supabase.from('profiles').delete().eq('id', id);
          if (error) throw error;
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`Clerk webhook handler error (${event.type}):`, err);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}

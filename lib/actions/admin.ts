'use server';

import { requireActionAuth, syncClerkMetadata } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/notifications/create-notification';
import type { ActionResult } from '@/lib/types';

export async function verifyBusiness(businessId: string): Promise<ActionResult> {
  const session = await requireActionAuth(['admin']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, verified')
    .eq('id', businessId)
    .single();

  if (!business) return { error: 'Business not found' };
  if (business.verified) return { error: 'Business is already verified' };

  const { error } = await supabase
    .from('businesses')
    .update({
      verified: true,
      verified_at: new Date().toISOString(),
      verified_by: session.userId,
    })
    .eq('id', businessId);

  if (error) return { error: error.message };

  await syncClerkMetadata(businessId, { verified: true });

  const { error: notifyError } = await createNotification({
    userId: businessId,
    title: 'Business verified',
    body: `${business.business_name} has been verified. You can now post shifts.`,
    link: '/biz/dashboard',
  });
  if (notifyError) console.error('createNotification failed:', notifyError);

  return { success: true };
}

export async function suspendUser(userId: string, suspended = true): Promise<ActionResult> {
  const session = await requireActionAuth(['admin']);
  if (session.error) return { error: session.error };

  if (userId === session.userId) return { error: 'Cannot suspend your own account' };

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from('profiles').select('id, email').eq('id', userId).single();
  if (!profile) return { error: 'User not found' };

  const { error } = await supabase
    .from('profiles')
    .update({ suspended })
    .eq('id', userId);

  if (error) return { error: error.message };

  await syncClerkMetadata(userId, { suspended });

  if (suspended) {
    const { error: notifyError } = await createNotification({
      userId,
      title: 'Account suspended',
      body: 'Your account has been suspended. Contact support for assistance.',
      link: '/suspended',
    });
    if (notifyError) console.error('createNotification failed:', notifyError);
  }

  return { success: true };
}

'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserNotifications, type NotificationRecord } from '@/lib/queries/notifications';
import type { ActionResult } from '@/lib/types';

export interface NotificationInput {
  userId: string;
  title: string;
  body: string;
  link?: string;
}

export async function createNotification(input: NotificationInput): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      link: input.link ?? null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { success: true, data: { id: data.id } };
}

export async function fetchNotifications(): Promise<ActionResult<NotificationRecord[]>> {
  const session = await requireActionAuth();
  if (session.error) return { error: session.error };

  const items = await getUserNotifications(session.userId, 10);
  return { success: true, data: items };
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const session = await requireActionAuth();
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', session.userId);

  if (error) return { error: error.message };
  return { success: true };
}

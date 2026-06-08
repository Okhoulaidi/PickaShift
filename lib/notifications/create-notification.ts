import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult } from '@/lib/types';

export interface NotificationInput {
  userId: string;
  title: string;
  body: string;
  link?: string;
}

/** Internal only — do not expose as a client-callable action */
export async function createNotification(
  input: NotificationInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', input.userId)
    .maybeSingle();

  if (!profile) return { error: 'Invalid userId' };

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

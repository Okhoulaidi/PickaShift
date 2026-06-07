'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult } from '@/lib/types';

export async function addToTalentPool(studentId: string, note?: string): Promise<ActionResult> {
  const auth = await requireActionAuth(['business']);
  if (auth.error) return { error: auth.error };

  const supabase = createAdminClient();
  const { error } = await supabase.from('talent_pool').upsert(
    {
      business_id: auth.userId,
      student_id: studentId,
      note: note ?? null,
      added_at: new Date().toISOString(),
    },
    { onConflict: 'business_id,student_id' },
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function removeFromTalentPool(entryId: string): Promise<ActionResult> {
  const auth = await requireActionAuth(['business']);
  if (auth.error) return { error: auth.error };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('talent_pool')
    .delete()
    .eq('id', entryId)
    .eq('business_id', auth.userId);

  if (error) return { error: error.message };
  return { success: true };
}

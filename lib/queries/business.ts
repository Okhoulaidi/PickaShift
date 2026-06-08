import { createAdminClient } from '@/lib/supabase/admin';

export async function getBusinessProfile(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`[getBusinessProfile] error for ${userId}:`, error.code, error.message);
    return null;
  }

  return data;
}

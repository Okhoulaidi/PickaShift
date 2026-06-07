import { createAdminClient } from '@/lib/supabase/admin';

export async function getBusinessProfile(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn(`[getBusinessProfile] No business row for user ${userId}`);
    } else {
      console.error(`[getBusinessProfile] Supabase error for user ${userId}:`, error.message, error.code);
    }
    return null;
  }

  return data;
}

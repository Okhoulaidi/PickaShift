import { createAdminClient } from '@/lib/supabase/admin';

export async function getStudentProfile(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn(`[getStudentProfile] No student row for user ${userId}`);
    } else {
      console.error(`[getStudentProfile] Supabase error for user ${userId}:`, error.message, error.code);
    }
    return null;
  }

  return data;
}

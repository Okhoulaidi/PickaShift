import { createAdminClient } from '@/lib/supabase/admin';

export async function getStudentProfile(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`[getStudentProfile] error for ${userId}:`, error.code, error.message);
    return null;
  }

  return data;
}

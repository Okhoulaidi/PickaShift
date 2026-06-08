import { createAdminClient } from '@/lib/supabase/admin';
import type { ContactSubmission } from '@/lib/types';

export async function getContactSubmissions(limit = 100): Promise<ContactSubmission[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getContactSubmissions]', error.code, error.message);
    return [];
  }

  return (data ?? []) as ContactSubmission[];
}

export async function getContactSubmissionCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('[getContactSubmissionCount]', error.code, error.message);
    return 0;
  }

  return count ?? 0;
}

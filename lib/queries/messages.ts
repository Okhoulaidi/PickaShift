import { createAdminClient } from '@/lib/supabase/admin';

const CONVERSATION_SELECT = `
  *,
  shift:shifts(id, title, shift_date, start_time, end_time),
  student:students!inner(
    id,
    profile:profiles(first_name, last_name, avatar_url, email)
  ),
  business:businesses!inner(
    id,
    business_name,
    logo_url,
    profile:profiles(first_name, last_name, avatar_url, email)
  )
`;

export async function getConversations(userId: string, role: 'student' | 'business') {
  const supabase = createAdminClient();
  const column = role === 'student' ? 'student_id' : 'business_id';

  const { data, error } = await supabase
    .from('conversations')
    .select(CONVERSATION_SELECT)
    .eq(column, userId)
    .order('last_message_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getConversationById(id: string, userId: string, role: 'student' | 'business' | 'admin') {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('conversations')
    .select(CONVERSATION_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  if (role !== 'admin' && data.student_id !== userId && data.business_id !== userId) {
    return null;
  }

  return data;
}

export async function getMessages(conversationId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(first_name, last_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLastMessagePreview(conversationId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('messages')
    .select('body, sent_at')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

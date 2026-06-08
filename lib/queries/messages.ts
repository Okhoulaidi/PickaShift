import { createAdminClient } from '@/lib/supabase/admin';

const CONVERSATION_SELECT = `
  *,
  shift:shifts(id, title, shift_date, start_time, end_time),
  student:students(id, university, degree),
  business:businesses(id, business_name, logo_url)
`;

type ProfileSnippet = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
};

async function attachParticipantProfiles<T extends { student_id: string; business_id: string }>(
  rows: T[],
): Promise<(T & { student_profile: ProfileSnippet | null; business_profile: ProfileSnippet | null })[]> {
  if (!rows.length) {
    return rows.map((row) => ({ ...row, student_profile: null, business_profile: null }));
  }

  const supabase = createAdminClient();
  const ids = [...new Set(rows.flatMap((row) => [row.student_id, row.business_id]))];
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, email')
    .in('id', ids);

  if (error) {
    console.error('[attachParticipantProfiles]', error.code, error.message);
    return rows.map((row) => ({ ...row, student_profile: null, business_profile: null }));
  }

  const map = new Map((profiles ?? []).map((p) => [p.id, p as ProfileSnippet]));
  return rows.map((row) => ({
    ...row,
    student_profile: map.get(row.student_id) ?? null,
    business_profile: map.get(row.business_id) ?? null,
  }));
}

export async function getConversations(userId: string, role: 'student' | 'business') {
  try {
    const supabase = createAdminClient();
    const column = role === 'student' ? 'student_id' : 'business_id';

    const { data, error } = await supabase
      .from('conversations')
      .select(CONVERSATION_SELECT)
      .eq(column, userId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('[getConversations]', error.code, error.message);
      return [];
    }

    return attachParticipantProfiles(data ?? []);
  } catch (err) {
    console.error('[getConversations]', err);
    return [];
  }
}

export async function getConversationById(id: string, userId: string, role: 'student' | 'business' | 'admin') {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('conversations').select(CONVERSATION_SELECT).eq('id', id).single();

    if (error) {
      console.error('[getConversationById]', error.code, error.message);
      return null;
    }

    if (!data) return null;

    if (role !== 'admin' && data.student_id !== userId && data.business_id !== userId) {
      return null;
    }

    const [enriched] = await attachParticipantProfiles([data]);
    return enriched ?? null;
  } catch (err) {
    console.error('[getConversationById]', err);
    return null;
  }
}

export async function getMessages(conversationId: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('[getMessages]', error.code, error.message);
      return [];
    }

    if (!data?.length) return [];

    const senderIds = [...new Set(data.map((m) => m.sender_id))];
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', senderIds);

    if (profileError) {
      console.error('[getMessages] profiles:', profileError.code, profileError.message);
      return data.map((m) => ({ ...m, sender: null }));
    }

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    return data.map((m) => ({ ...m, sender: profileMap.get(m.sender_id) ?? null }));
  } catch (err) {
    console.error('[getMessages]', err);
    return [];
  }
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

export type ConversationWithProfiles = Awaited<ReturnType<typeof getConversations>>[number];

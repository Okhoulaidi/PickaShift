'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult } from '@/lib/types';

export async function createConversation(
  shiftId: string,
  studentId: string,
  businessId: string
): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('shift_id', shiftId)
    .eq('student_id', studentId)
    .maybeSingle();

  if (existing) return { success: true, data: { id: existing.id } };

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      shift_id: shiftId,
      student_id: studentId,
      business_id: businessId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { success: true, data: { id: data.id } };
}

export async function sendMessage(conversationId: string, body: string): Promise<ActionResult<{ id: string }>> {
  const session = await requireActionAuth(['student', 'business', 'admin']);
  if (session.error) return { error: session.error };

  const trimmed = body.trim();
  if (!trimmed) return { error: 'Message cannot be empty' };

  const supabase = createAdminClient();
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, student_id, business_id')
    .eq('id', conversationId)
    .single();

  if (!conversation) return { error: 'Conversation not found' };

  const isParticipant =
    session.meta!.role === 'admin' ||
    conversation.student_id === session.userId ||
    conversation.business_id === session.userId;

  if (!isParticipant) return { error: 'Forbidden' };

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: session.userId,
      body: trimmed,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return { success: true, data: { id: data.id } };
}

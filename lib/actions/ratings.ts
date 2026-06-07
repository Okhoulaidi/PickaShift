'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/actions/notifications';
import type { ActionResult } from '@/lib/types';

export interface RatingInput {
  shiftId: string;
  ratedId: string;
  score: number;
  comment?: string;
}

export async function submitRating(input: RatingInput): Promise<ActionResult> {
  const session = await requireActionAuth(['student', 'business']);
  if (session.error) return { error: session.error };

  if (input.score < 1 || input.score > 5) return { error: 'Score must be between 1 and 5' };
  if (input.ratedId === session.userId) return { error: 'You cannot rate yourself' };

  const supabase = createAdminClient();
  const { data: shift } = await supabase
    .from('shifts')
    .select('id, business_id, status')
    .eq('id', input.shiftId)
    .single();

  if (!shift) return { error: 'Shift not found' };
  if (shift.status !== 'completed' && shift.status !== 'filled') {
    return { error: 'Shift must be completed before rating' };
  }

  if (session.meta!.role === 'business') {
    if (shift.business_id !== session.userId) return { error: 'Forbidden' };
    const { data: app } = await supabase
      .from('applications')
      .select('id')
      .eq('shift_id', input.shiftId)
      .eq('student_id', input.ratedId)
      .eq('status', 'completed')
      .maybeSingle();
    if (!app) return { error: 'You can only rate students who completed this shift' };
  } else {
    const { data: app } = await supabase
      .from('applications')
      .select('id')
      .eq('shift_id', input.shiftId)
      .eq('student_id', session.userId)
      .eq('status', 'completed')
      .maybeSingle();
    if (!app || input.ratedId !== shift.business_id) {
      return { error: 'You can only rate the business for a shift you completed' };
    }
  }

  const { error } = await supabase.from('ratings').insert({
    shift_id: input.shiftId,
    rater_id: session.userId,
    rated_id: input.ratedId,
    score: input.score,
    comment: input.comment ?? null,
  });

  if (error) {
    if (error.code === '23505') return { error: 'You have already rated this shift' };
    return { error: error.message };
  }

  await createNotification({
    userId: input.ratedId,
    title: 'New rating received',
    body: `You received a ${input.score}-star rating.`,
    link: session.meta!.role === 'student' ? '/dashboard/profile' : '/biz/dashboard',
  });

  return { success: true };
}

'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createConversation } from '@/lib/actions/messages';
import { createNotification } from '@/lib/notifications/create-notification';
import { shiftHours } from '@/lib/utils';
import type { ActionResult } from '@/lib/types';
import { unwrapRelation } from '@/lib/types';

export async function applyToShift(shiftId: string): Promise<ActionResult<{ id: string }>> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: shift } = await supabase
    .from('shifts')
    .select('id, title, status, business_id, business:businesses!inner(verified, business_name)')
    .eq('id', shiftId)
    .single();

  if (!shift || shift.status !== 'open') return { error: 'Shift is not available' };
  const business = unwrapRelation(shift.business);
  if (!business?.verified) return { error: 'Shift is not available' };

  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('shift_id', shiftId)
    .eq('student_id', session.userId)
    .maybeSingle();

  if (existing) return { error: 'You have already applied to this shift' };

  const { data, error } = await supabase
    .from('applications')
    .insert({ shift_id: shiftId, student_id: session.userId, status: 'pending' })
    .select('id')
    .single();

  if (error) return { error: error.message };

  const { error: notifyError } = await createNotification({
    userId: shift.business_id,
    title: 'New application',
    body: `A student applied to "${shift.title}".`,
    link: '/biz/applicants',
  });
  if (notifyError) console.error('createNotification failed:', notifyError);

  return { success: true, data: { id: data.id } };
}

export async function acceptApplication(applicationId: string): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: application } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      student_id,
      shift:shifts!inner(id, title, business_id, workers_needed, workers_confirmed, status)
    `)
    .eq('id', applicationId)
    .single();

  if (!application) return { error: 'Application not found' };
  const shift = unwrapRelation(application.shift);
  if (!shift) return { error: 'Shift not found' };

  if (shift.business_id !== session.userId) return { error: 'Forbidden' };
  if (application.status !== 'pending') return { error: 'Application is not pending' };
  if (shift.status !== 'open' && shift.workers_confirmed >= shift.workers_needed) {
    return { error: 'Shift is already full' };
  }

  const { error } = await supabase
    .from('applications')
    .update({ status: 'accepted', responded_at: new Date().toISOString() })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  const { error: convError } = await createConversation(shift.id, application.student_id, shift.business_id);
  if (convError) return { error: convError };

  const { error: notifyError } = await createNotification({
    userId: application.student_id,
    title: 'Application accepted',
    body: `You were accepted for "${shift.title}".`,
    link: '/dashboard/applications',
  });
  if (notifyError) console.error('createNotification failed:', notifyError);

  return { success: true };
}

export async function rejectApplication(applicationId: string): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: application } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      student_id,
      shift:shifts!inner(title, business_id)
    `)
    .eq('id', applicationId)
    .single();

  if (!application) return { error: 'Application not found' };
  const shift = unwrapRelation(application.shift);
  if (!shift) return { error: 'Shift not found' };
  if (shift.business_id !== session.userId) return { error: 'Forbidden' };
  if (application.status !== 'pending') return { error: 'Application is not pending' };

  const { error } = await supabase
    .from('applications')
    .update({ status: 'rejected', responded_at: new Date().toISOString() })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  const { error: notifyError } = await createNotification({
    userId: application.student_id,
    title: 'Application declined',
    body: `Your application for "${shift.title}" was not accepted.`,
    link: '/dashboard/applications',
  });
  if (notifyError) console.error('createNotification failed:', notifyError);

  return { success: true };
}

export async function completeApplication(applicationId: string): Promise<ActionResult> {
  const session = await requireActionAuth(['business', 'admin']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: application } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      student_id,
      shift:shifts!inner(
        id,
        title,
        business_id,
        pay_per_hour_cents,
        start_time,
        end_time,
        status
      )
    `)
    .eq('id', applicationId)
    .single();

  if (!application) return { error: 'Application not found' };
  const shift = unwrapRelation(application.shift);
  if (!shift) return { error: 'Shift not found' };

  if (session.meta!.role === 'business' && shift.business_id !== session.userId) {
    return { error: 'Forbidden' };
  }
  if (application.status !== 'accepted') return { error: 'Only accepted applications can be completed' };

  const { error } = await supabase
    .from('applications')
    .update({ status: 'completed', responded_at: new Date().toISOString() })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  const hours = shiftHours(shift.start_time, shift.end_time);
  const earnedCents = Math.round(shift.pay_per_hour_cents * hours);

  const { data: student } = await supabase
    .from('students')
    .select('shifts_completed, total_earned_cents')
    .eq('id', application.student_id)
    .single();

  await supabase
    .from('students')
    .update({
      shifts_completed: (student?.shifts_completed ?? 0) + 1,
      total_earned_cents: (student?.total_earned_cents ?? 0) + earnedCents,
    })
    .eq('id', application.student_id);

  const { count: remainingAccepted } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('shift_id', shift.id)
    .eq('status', 'accepted');

  if ((remainingAccepted ?? 0) === 0) {
    await supabase.from('shifts').update({ status: 'completed' }).eq('id', shift.id);
  }

  const { error: notifyError } = await createNotification({
    userId: application.student_id,
    title: 'Shift completed',
    body: `"${shift.title}" has been marked complete.`,
    link: '/dashboard/applications',
  });
  if (notifyError) console.error('createNotification failed:', notifyError);

  return { success: true };
}

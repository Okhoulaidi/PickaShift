'use server';

import { requireActionAuth } from '@/lib/auth';
import { getDistrictCoords } from '@/lib/geo';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNotification } from '@/lib/notifications/create-notification';
import type { ActionResult } from '@/lib/types';

export interface ShiftInput {
  title: string;
  description: string;
  district: string;
  address?: string;
  lat?: number;
  lng?: number;
  shiftDate: string;
  startTime: string;
  endTime: string;
  payPerHourCents: number;
  workersNeeded?: number;
  skillsNeeded?: string[];
  isUrgent?: boolean;
}

export async function createShift(input: ShiftInput): Promise<ActionResult<{ id: string }>> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();

  const coords = input.lat != null && input.lng != null
    ? { lat: input.lat, lng: input.lng }
    : getDistrictCoords(input.district);

  const { data, error } = await supabase
    .from('shifts')
    .insert({
      business_id: session.userId,
      title: input.title,
      description: input.description,
      district: input.district,
      address: input.address ?? null,
      lat: coords.lat,
      lng: coords.lng,
      shift_date: input.shiftDate,
      start_time: input.startTime,
      end_time: input.endTime,
      pay_per_hour_cents: input.payPerHourCents,
      workers_needed: input.workersNeeded ?? 1,
      skills_needed: input.skillsNeeded ?? [],
      is_urgent: input.isUrgent ?? false,
      status: 'open',
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  const { data: biz } = await supabase
    .from('businesses')
    .select('shifts_posted')
    .eq('id', session.userId)
    .single();

  await supabase
    .from('businesses')
    .update({ shifts_posted: (biz?.shifts_posted ?? 0) + 1 })
    .eq('id', session.userId);

  return { success: true, data: { id: data.id } };
}

export async function updateShift(shiftId: string, input: Partial<ShiftInput>): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: shift } = await supabase
    .from('shifts')
    .select('business_id, status')
    .eq('id', shiftId)
    .single();

  if (!shift || shift.business_id !== session.userId) return { error: 'Shift not found' };
  if (shift.status !== 'open') return { error: 'Only open shifts can be edited' };

  const updates: Record<string, unknown> = {};
  if (input.title != null) updates.title = input.title;
  if (input.description != null) updates.description = input.description;
  if (input.district != null) {
    updates.district = input.district;
    if (input.lat == null && input.lng == null) {
      const coords = getDistrictCoords(input.district);
      updates.lat = coords.lat;
      updates.lng = coords.lng;
    }
  }
  if (input.address != null) updates.address = input.address;
  if (input.lat != null) updates.lat = input.lat;
  if (input.lng != null) updates.lng = input.lng;
  if (input.shiftDate != null) updates.shift_date = input.shiftDate;
  if (input.startTime != null) updates.start_time = input.startTime;
  if (input.endTime != null) updates.end_time = input.endTime;
  if (input.payPerHourCents != null) updates.pay_per_hour_cents = input.payPerHourCents;
  if (input.workersNeeded != null) updates.workers_needed = input.workersNeeded;
  if (input.skillsNeeded != null) updates.skills_needed = input.skillsNeeded;
  if (input.isUrgent != null) updates.is_urgent = input.isUrgent;

  const { error } = await supabase.from('shifts').update(updates).eq('id', shiftId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function cancelShift(shiftId: string): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { data: shift } = await supabase
    .from('shifts')
    .select('business_id, status, title')
    .eq('id', shiftId)
    .single();

  if (!shift || shift.business_id !== session.userId) return { error: 'Shift not found' };
  if (shift.status === 'cancelled' || shift.status === 'completed') {
    return { error: 'Shift cannot be cancelled' };
  }

  const { data: applications } = await supabase
    .from('applications')
    .select('student_id, status')
    .eq('shift_id', shiftId)
    .in('status', ['pending', 'accepted']);

  const { error } = await supabase.from('shifts').update({ status: 'cancelled' }).eq('id', shiftId);
  if (error) return { error: error.message };

  const { error: appsError } = await supabase
    .from('applications')
    .update({ status: 'cancelled' })
    .eq('shift_id', shiftId)
    .in('status', ['pending', 'accepted']);

  if (appsError) return { error: appsError.message };

  await Promise.all(
    (applications ?? []).map(async (app) => {
      const { error: notifyError } = await createNotification({
        userId: app.student_id,
        title: 'Shift cancelled',
        body: 'A shift you applied to has been cancelled.',
        link: '/dashboard/applications',
      });
      if (notifyError) console.error('createNotification failed:', notifyError);
    }),
  );

  return { success: true };
}

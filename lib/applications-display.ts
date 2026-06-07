import { unwrapRelation } from '@/lib/types';
import type { getStudentApplications } from '@/lib/queries/shifts';

export interface ApplicationRow {
  id: string;
  status: string;
  appliedAt: string;
  title: string;
  businessName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  district: string;
  payCents: number;
}

export function mapApplications(
  apps: Awaited<ReturnType<typeof getStudentApplications>>,
): ApplicationRow[] {
  return apps.map((app) => {
    const shift = unwrapRelation(app.shift);
    const biz = shift ? unwrapRelation(shift.business) : null;
    return {
      id: app.id,
      status: app.status,
      appliedAt: app.applied_at,
      title: shift?.title ?? 'Shift',
      businessName: biz?.business_name ?? 'Business',
      shiftDate: shift?.shift_date ?? '',
      startTime: shift?.start_time ?? '',
      endTime: shift?.end_time ?? '',
      district: shift?.district ?? '',
      payCents: shift?.pay_per_hour_cents ?? 0,
    };
  });
}

import { notFound } from 'next/navigation';
import { ShiftDetailBizClient } from '@/components/biz/ShiftDetailBizClient';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats, getShiftApplicants, getShiftById } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export default async function BizShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session, profile: business } = await requireBusinessProfile();

  const shift = await getShiftById(id);
  if (!shift || shift.business_id !== session.userId) notFound();

  const [stats, applicants] = await Promise.all([
    getDashboardStats('business', session.userId),
    getShiftApplicants(id),
  ]);

  const mapped = applicants.map((app) => {
    const student = unwrapRelation(app.student);
    const profile = student ? unwrapRelation(student.profile) : null;
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student';
    return {
      id: app.id,
      status: app.status,
      studentId: app.student_id,
      name,
      sub: `${student?.university ?? ''} · ${student?.shifts_completed ?? 0} shifts`,
      score: Number(student?.reliability_score ?? 5),
      skills: student?.skills ?? [],
    };
  });

  return (
    <ShiftDetailBizClient
      user={businessDashUser(business)}
      stats={stats}
      shift={{
        id: shift.id,
        title: shift.title,
        description: shift.description,
        shiftDate: shift.shift_date,
        startTime: shift.start_time,
        endTime: shift.end_time,
        district: shift.district,
        payCents: shift.pay_per_hour_cents,
        status: shift.status,
        workersConfirmed: shift.workers_confirmed,
        workersNeeded: shift.workers_needed,
      }}
      applicants={mapped}
    />
  );
}

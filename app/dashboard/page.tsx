import { requireRole } from '@/lib/auth';
import { StudentDashboardClient } from '@/components/dashboard/StudentDashboardClient';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats, getOpenShifts, getStudentApplications } from '@/lib/queries/shifts';
import { getStudentAppliedShiftIds, getStudentProfile } from '@/lib/queries/users';
import { unwrapRelation } from '@/lib/types';
import type { ShiftWithBusiness } from '@/lib/types';

export default async function StudentDashboardPage() {
  const session = await requireRole(['student']);
  const [stats, student, applications, allShifts, appliedIds] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
    getStudentApplications(session.userId, 'accepted'),
    getOpenShifts({ limit: 12 }),
    getStudentAppliedShiftIds(session.userId),
  ]);

  const profile = unwrapRelation(student?.profile) ?? session.user;
  const district = student?.district ?? '';
  const nearbyShifts = (district
    ? (allShifts as ShiftWithBusiness[]).filter((s) => s.district === district)
    : (allShifts as ShiftWithBusiness[])
  ).slice(0, 8);

  const upcoming = applications.map((app) => {
    const shift = unwrapRelation(app.shift);
    const biz = shift ? unwrapRelation(shift.business) : null;
    return {
      id: app.id,
      title: shift?.title ?? 'Shift',
      businessName: biz?.business_name ?? 'Business',
      shiftDate: shift?.shift_date ?? '',
      startTime: shift?.start_time ?? '',
      endTime: shift?.end_time ?? '',
      district: shift?.district ?? '',
    };
  });

  const user = studentDashUser(
    {
      first_name: profile.first_name ?? session.user.firstName,
      last_name: profile.last_name ?? session.user.lastName,
    },
    student,
  );

  return (
    <StudentDashboardClient
      user={user}
      stats={stats}
      nearbyShifts={nearbyShifts}
      upcoming={upcoming}
      appliedIds={[...appliedIds]}
      firstName={profile.first_name ?? session.user.firstName ?? 'there'}
      district={district}
    />
  );
}

import { requireRole } from '@/lib/auth';
import { mapApplications } from '@/lib/applications-display';
import { ApplicationsClient } from '@/components/dashboard/ApplicationsClient';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats, getStudentApplications } from '@/lib/queries/shifts';
import { getStudentProfile } from '@/lib/queries/users';
import { unwrapRelation } from '@/lib/types';

export default async function ApplicationsPage() {
  const session = await requireRole(['student']);

  const [stats, student, applications] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
    getStudentApplications(session.userId),
  ]);

  const profile = unwrapRelation(student?.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName ?? null,
      last_name: profile?.last_name ?? session.user.lastName ?? null,
    },
    student,
  );

  const mapped = mapApplications(applications);
  const pending = mapped.filter((a) => a.status === 'pending');
  const confirmed = mapped.filter((a) => a.status === 'accepted');
  const completed = mapped.filter((a) => a.status === 'completed' || a.status === 'rejected');

  return (
    <ApplicationsClient
      user={user}
      stats={stats}
      pending={pending}
      confirmed={confirmed}
      completed={completed}
    />
  );
}

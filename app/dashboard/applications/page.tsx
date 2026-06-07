import { requireRole } from '@/lib/auth';
import { ApplicationsClient, mapApplications } from '@/components/dashboard/ApplicationsClient';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats, getStudentApplications } from '@/lib/queries/shifts';
import { getStudentProfile } from '@/lib/queries/users';
import { unwrapRelation } from '@/lib/types';

export default async function ApplicationsPage() {
  const session = await requireRole(['student']);
  const [stats, student, pending, confirmed, completed] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
    getStudentApplications(session.userId, 'pending'),
    getStudentApplications(session.userId, 'accepted'),
    getStudentApplications(session.userId, 'completed'),
  ]);

  const profile = unwrapRelation(student?.profile) ?? session.user;
  const user = studentDashUser(
    {
      first_name: profile.first_name ?? session.user.firstName,
      last_name: profile.last_name ?? session.user.lastName,
    },
    student,
  );

  return (
    <ApplicationsClient
      user={user}
      stats={stats}
      pending={mapApplications(pending)}
      confirmed={mapApplications(confirmed)}
      completed={mapApplications(completed)}
    />
  );
}

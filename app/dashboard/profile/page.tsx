import { requireRole } from '@/lib/auth';
import { StudentProfileClient } from '@/components/dashboard/StudentProfileClient';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getStudentProfile } from '@/lib/queries/users';
import { UNIVERSITIES } from '@/lib/constants';
import { unwrapRelation } from '@/lib/types';

export default async function StudentProfilePage() {
  const session = await requireRole(['student']);
  const [stats, student] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
  ]);

  const profile = unwrapRelation(student?.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  return (
    <StudentProfileClient
      user={user}
      stats={stats}
      initial={{
        university: student?.university ?? UNIVERSITIES[0],
        degree: student?.degree ?? '',
        yearOfStudy: student?.year_of_study ?? 1,
        bio: student?.bio ?? '',
        district: student?.district ?? 'Centro',
        skills: student?.skills ?? [],
        availability: (student?.availability as Record<string, string[]>) ?? {},
      }}
    />
  );
}

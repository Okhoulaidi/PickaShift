import { StudentProfileClient } from '@/components/dashboard/StudentProfileClient';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getDashboardStats } from '@/lib/queries/shifts';
import { UNIVERSITIES } from '@/lib/constants';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function StudentProfilePage() {
  const { session, profile: student } = await requireStudentProfile();
  const stats = await getDashboardStats('student', session.userId);

  const profile = unwrapRelation(student.profile);
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
        university: student.university ?? UNIVERSITIES[0],
        degree: student.degree ?? '',
        yearOfStudy: student.year_of_study ?? 1,
        bio: student.bio ?? '',
        district: student.district ?? 'Centro',
        skills: student.skills ?? [],
        availability: (student.availability as Record<string, string[]>) ?? {},
      }}
    />
  );
}

import { DashShell } from '@/components/layout/DashShell';
import { CvUploadClient } from '@/components/dashboard/CvUploadClient';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { unwrapRelation } from '@/lib/types';

export default async function CvPage() {
  const { session, profile: student } = await requireStudentProfile();
  const profile = unwrapRelation(student.profile);

  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  return (
    <DashShell nav={studentNav()} active="My CV" user={user} topTitle="My CV" topSub="Upload your CV — businesses can view it when reviewing your applications">
      <div className="content">
        <CvUploadClient currentCvUrl={student.cv_url ?? null} />
      </div>
    </DashShell>
  );
}

import { getTranslations } from 'next-intl/server';
import { DashShell } from '@/components/layout/DashShell';
import { CvUploadClient } from '@/components/dashboard/CvUploadClient';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CvPage() {
  const t = await getTranslations('dashboard.cv');
  const tNav = await getTranslations('nav.student');
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
    <DashShell nav={studentNav(tNav)} active={tNav('myCv')} user={user} topTitle={t('title')} topSub={t('subtitle')}>
      <div className="content">
        <CvUploadClient currentCvUrl={student.cv_url ?? null} />
      </div>
    </DashShell>
  );
}

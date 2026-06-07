import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { studentDashUser } from '@/lib/dashboard-user';
import { studentNav } from '@/lib/dashboard-nav';
import { DashShell } from '@/components/layout/DashShell';
import { CvUploadClient } from '@/components/dashboard/CvUploadClient';

export default async function CvPage() {
  const session = await requireRole(['student']);
  const supabase = createAdminClient();

  const { data: student } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .eq('id', session.userId)
    .single();

  const profile = Array.isArray(student?.profile) ? student?.profile[0] : student?.profile;

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
        <CvUploadClient currentCvUrl={student?.cv_url ?? null} />
      </div>
    </DashShell>
  );
}

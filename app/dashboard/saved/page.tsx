import { requireRole } from '@/lib/auth';
import { studentDashUser } from '@/lib/dashboard-user';
import { studentNav } from '@/lib/dashboard-nav';
import { DashShell } from '@/components/layout/DashShell';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default async function SavedShiftsPage() {
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
    <DashShell
      nav={studentNav()}
      active="Saved Shifts"
      user={user}
      topTitle="Saved Shifts"
      topSub="Bookmark shifts to apply later — coming soon"
    >
      <div className="content">
        <div className="panel">
          <div className="panel-body">
            <div className="empty-state" style={{ padding: '64px 24px' }}>
              <span className="ds-ico" style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 16 }}>
                <Icon name="bookmark" size={26} />
              </span>
              <h3>Coming soon</h3>
              <p style={{ marginTop: 8, maxWidth: 360 }}>
                Saved shifts are on the way. You&apos;ll be able to bookmark openings from browse and apply when you&apos;re ready.
              </p>
              <Link href="/browse" className="btn btn-primary" style={{ marginTop: 20 }}>
                <Icon name="search" size={16} /> Browse Shifts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getBusinessProfile } from '@/lib/queries/users';
import { getDashboardStats } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import { unwrapRelation } from '@/lib/types';
import { bizColor, initials, formatShiftDate } from '@/lib/utils';

export default async function BizApplicantsPage() {
  const session = await requireRole(['business']);
  const [business, stats] = await Promise.all([
    getBusinessProfile(session.userId),
    getDashboardStats('business', session.userId),
  ]);

  if (!business) return <div className="center-page">Business profile not found.</div>;

  const supabase = createAdminClient();

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at,
      shift:shifts!inner(id, title, shift_date, district, business_id),
      student:students(university, degree, cv_url,
        profile:profiles(first_name, last_name, avatar_url)
      )
    `)
    .eq('shift.business_id', session.userId)
    .order('applied_at', { ascending: false });

  const grouped: Record<string, typeof applications> = {};
  for (const app of applications ?? []) {
    const shift = unwrapRelation(app.shift);
    if (!shift) continue;
    const key = shift.id as string;
    if (!grouped[key]) grouped[key] = [];
    grouped[key]!.push(app);
  }

  const user = businessDashUser(business);
  const pending = (applications ?? []).filter((a) => a.status === 'pending').length;

  return (
    <DashShell
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, pending)}
      active="Applicants"
      user={user}
      topTitle="Applicants"
      topSub="All applications across your shifts"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        {Object.keys(grouped).length === 0 ? (
          <div className="panel">
            <div className="panel-body">
              <div className="empty-state" style={{ padding: '64px 24px' }}>
                <span className="ds-ico" style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 16 }}>
                  <Icon name="clipboard" size={26} />
                </span>
                <h3>No applicants yet</h3>
                <p style={{ marginTop: 8 }}>Post a shift to start receiving applications.</p>
                <Link href="/biz/shifts/new" className="btn btn-primary" style={{ marginTop: 20 }}>
                  <Icon name="plus" size={16} /> Post a Shift
                </Link>
              </div>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([, apps]) => {
            const firstApp = apps![0];
            const shift = unwrapRelation(firstApp?.shift);
            if (!shift) return null;
            return (
              <div className="panel" key={shift.id as string}>
                <div className="panel-head">
                  <div>
                    <h3>{shift.title as string}</h3>
                    <div className="ph-sub">
                      {formatShiftDate(shift.shift_date as string)} · {shift.district as string} · {apps!.length} applicant{apps!.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Link href={`/biz/shifts/${shift.id}`} className="btn btn-sm btn-outline">
                    Manage shift →
                  </Link>
                </div>
                <div style={{ padding: 0 }}>
                  <div className="appl-head">
                    <span>Applicant</span>
                    <span>University</span>
                    <span>Status</span>
                    <span />
                  </div>
                  {apps!.map((app) => {
                    const student = unwrapRelation(app.student);
                    const profile = student ? unwrapRelation(student.profile) : null;
                    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student';
                    return (
                      <div className="appl-row" key={app.id}>
                        <div className="appl-person">
                          <div className="avatar md" style={{ background: bizColor(name) }}>
                            {initials(name)}
                          </div>
                          <div>
                            <div className="ap-name">{name}</div>
                            <div className="ap-sub">{student?.degree ?? ''}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
                          {student?.university?.replace(/\s*\([^)]*\)\s*/g, '').trim() ?? '—'}
                        </span>
                        <span
                          className={`badge ${
                            app.status === 'accepted' ? 'badge-open' :
                            app.status === 'rejected' ? 'badge-filled' :
                            'badge-soft'
                          }`}
                        >
                          {app.status}
                        </span>
                        <div className="appl-actions">
                          {student?.cv_url && (
                            <a href={student.cv_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                              <Icon name="file" size={14} /> CV
                            </a>
                          )}
                          <Link href={`/biz/shifts/${shift.id}`} className="btn btn-sm btn-primary">
                            Review
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashShell>
  );
}

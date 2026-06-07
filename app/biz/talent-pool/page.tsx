import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile, getTalentPool } from '@/lib/queries/users';
import { bizColor, initials } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

export default async function TalentPoolPage() {
  const session = await requireRole(['business']);
  const [stats, business, pool] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
    getTalentPool(session.userId),
  ]);

  if (!business) return null;
  const user = businessDashUser(business);

  return (
    <DashShell variant="business"
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Worker Pool"
      user={user}
      topTitle="Talent pool"
      topSub="Workers you've saved for future shifts"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        {pool.length === 0 ? (
          <div className="empty-state panel">
            <h3>No saved workers yet</h3>
            <p>Save great workers from completed shifts to hire them again faster.</p>
          </div>
        ) : (
          <div className="panel">
            {pool.map((entry) => {
              const student = unwrapRelation(entry.student);
              const profile = student ? unwrapRelation(student.profile) : null;
              const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Worker';
              const color = bizColor(name);
              return (
                <div className="appl-row" key={entry.id}>
                  <div className="appl-person">
                    <span className="avatar md" style={{ background: color }}>
                      {initials(name)}
                    </span>
                    <div>
                      <div className="ap-name">{name}</div>
                      <div className="ap-sub">
                        {student?.university} · {student?.shifts_completed} shifts · Score{' '}
                        {Number(student?.reliability_score ?? 5).toFixed(1)}
                      </div>
                      {entry.note && (
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{entry.note}</div>
                      )}
                    </div>
                  </div>
                  <div className="score">
                    {(student?.skills ?? []).slice(0, 4).join(', ') || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashShell>
  );
}

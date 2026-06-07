import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats, getStudentApplications } from '@/lib/queries/shifts';
import { getStudentProfile } from '@/lib/queries/users';
import { formatPay, shiftHours } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

export default async function EarningsPage() {
  const session = await requireRole(['student']);
  const [stats, student, completedApps] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
    getStudentApplications(session.userId, 'completed'),
  ]);

  const profile = unwrapRelation(student?.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  let totalHours = 0;
  for (const app of completedApps) {
    const shift = unwrapRelation(app.shift);
    if (shift) totalHours += shiftHours(shift.start_time, shift.end_time);
  }

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Earnings"
      user={user}
      topTitle="Earnings"
      topSub="Your shift income on Pick a Shift"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="euro" size={20} />
              </div>
            </div>
            <div className="ds-num">{formatPay(stats.totalEarnedCents ?? 0)}</div>
            <div className="ds-lbl">Total earned</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="check" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.completedShifts ?? 0}</div>
            <div className="ds-lbl">Completed shifts</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="clock" size={20} />
              </div>
            </div>
            <div className="ds-num">{Math.round(totalHours)}h</div>
            <div className="ds-lbl">Hours worked</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="gauge" size={20} />
              </div>
            </div>
            <div className="ds-num">{Number(student?.reliability_score ?? 5).toFixed(1)}</div>
            <div className="ds-lbl">Reliability score</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recent completed shifts</h3>
          </div>
          <div className="panel-body">
            {completedApps.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
                No completed shifts yet. <Link href="/browse">Find your first shift</Link>
              </p>
            ) : (
              <div className="up-list">
                {completedApps.slice(0, 10).map((app) => {
                  const shift = unwrapRelation(app.shift);
                  const biz = shift ? unwrapRelation(shift.business) : null;
                  const hours = shift ? shiftHours(shift.start_time, shift.end_time) : 0;
                  const earned = shift ? Math.round(shift.pay_per_hour_cents * hours) : 0;
                  return (
                    <div className="up-item" key={app.id}>
                      <div className="up-info">
                        <div className="u-title">
                          {shift?.title} — {biz?.business_name}
                        </div>
                        <div className="u-meta">{shift?.shift_date}</div>
                      </div>
                      <strong style={{ color: 'var(--green)' }}>{formatPay(earned)}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getUserNotifications } from '@/lib/queries/notifications';
import { getStudentProfile } from '@/lib/queries/users';
import { unwrapRelation } from '@/lib/types';

export default async function NotificationsPage() {
  const session = await requireRole(['student']);
  const [stats, student, notifications] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentProfile(session.userId),
    getUserNotifications(session.userId, 50),
  ]);

  const profile = unwrapRelation(student?.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName ?? null,
      last_name: profile?.last_name ?? session.user.lastName ?? null,
    },
    student,
  );

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Home"
      user={user}
      topTitle="Notifications"
      topSub="Updates about your applications and shifts"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        {notifications.length === 0 ? (
          <div className="panel">
            <div className="panel-body">
              <div className="empty-state" style={{ padding: '64px 24px' }}>
                <span className="ds-ico" style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 16 }}>
                  <Icon name="bell" size={26} />
                </span>
                <h3>No notifications yet</h3>
                <p style={{ marginTop: 8 }}>When something happens on your applications, you&apos;ll see it here.</p>
                <Link href="/browse" className="btn btn-primary" style={{ marginTop: 20 }}>
                  Browse shifts
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="up-list" style={{ padding: '0 22px' }}>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? '#'}
                  className={`up-item notif-row${n.read_at ? '' : ' unread'}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="up-info">
                    <div className="u-title">{n.title}</div>
                    <div className="u-meta" style={{ marginTop: 4 }}>{n.body}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashShell>
  );
}

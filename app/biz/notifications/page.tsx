import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getUserNotifications } from '@/lib/queries/notifications';
import { getDashboardStats } from '@/lib/queries/shifts';

export const dynamic = 'force-dynamic';

export default async function BizNotificationsPage() {
  const { profile: business } = await requireBusinessProfile();
  const [stats, notifications] = await Promise.all([
    getDashboardStats('business', business.id),
    getUserNotifications(business.id, 50),
  ]);

  const user = businessDashUser(business);
  const pending = stats.pendingReview ?? 0;

  return (
    <DashShell
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, pending)}
      active="Overview"
      user={user}
      topTitle="Notifications"
      topSub="Updates about applicants and shifts"
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
                <p style={{ marginTop: 8 }}>Applicant updates and shift activity will appear here.</p>
                <Link href="/biz/shifts/new" className="btn btn-primary" style={{ marginTop: 20 }}>
                  Post a shift
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

import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { adminNav } from '@/lib/dashboard-nav';
import { adminDashUser } from '@/lib/dashboard-user';
import { getDashboardStats, getPlatformStats } from '@/lib/queries/shifts';
import { getProfile } from '@/lib/auth';

export default async function AdminPage() {
  const session = await requireRole(['admin']);
  const [stats, platform, profile] = await Promise.all([
    getDashboardStats('admin', session.userId),
    getPlatformStats(),
    getProfile(session.userId),
  ]);

  const user = adminDashUser({
    first_name: profile?.first_name ?? session.user.firstName,
    last_name: profile?.last_name ?? session.user.lastName,
    email: profile?.email ?? session.user.emailAddresses[0]?.emailAddress ?? '',
  });

  return (
    <DashShell
      nav={adminNav(stats.pendingVerifications ?? 0)}
      active="Overview"
      user={user}
      topTitle="Platform overview"
      topSub="Pick a Shift admin dashboard"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <nav className="admin-nav">
          <Link href="/admin" className="active">
            Overview
          </Link>
          <Link href="/admin/businesses">
            Verifications {stats.pendingVerifications ? `(${stats.pendingVerifications})` : ''}
          </Link>
          <Link href="/admin/users">Users</Link>
        </nav>

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="users" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.totalUsers ?? 0}</div>
            <div className="ds-lbl">Total users</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="briefcase" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.pendingVerifications ?? 0}</div>
            <div className="ds-lbl">Pending verifications</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="layers" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.totalOpenShifts ?? platform.openShifts}</div>
            <div className="ds-lbl">Open shifts</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="clipboard" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.applicationsToday ?? 0}</div>
            <div className="ds-lbl">Applications today</div>
          </div>
        </div>

        <div className="panel panel-body">
          <h3 style={{ margin: '0 0 16px', fontWeight: 900 }}>Platform stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{platform.students}</div>
              <div style={{ color: 'var(--muted)' }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{platform.businesses}</div>
              <div style={{ color: 'var(--muted)' }}>Verified businesses</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{platform.openShifts}</div>
              <div style={{ color: 'var(--muted)' }}>Open shifts</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{platform.completedShifts}</div>
              <div style={{ color: 'var(--muted)' }}>Completed shifts</div>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

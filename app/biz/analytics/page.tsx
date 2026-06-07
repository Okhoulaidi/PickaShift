import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessAnalytics, getBusinessProfile } from '@/lib/queries/users';

export default async function BizAnalyticsPage() {
  const session = await requireRole(['business']);
  const [stats, business, analytics] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
    getBusinessAnalytics(session.userId),
  ]);

  if (!business) return null;
  const user = businessDashUser(business);

  const cards = [
    { icon: 'briefcase' as const, num: analytics.totalShifts, lbl: 'Total shifts posted' },
    { icon: 'check' as const, num: analytics.completedShifts, lbl: 'Completed shifts' },
    { icon: 'users' as const, num: analytics.totalApplications, lbl: 'Total applications' },
    { icon: 'clipboard' as const, num: analytics.pendingApplications, lbl: 'Pending review' },
    { icon: 'star' as const, num: analytics.acceptedApplications, lbl: 'Accepted workers' },
    { icon: 'layers' as const, num: analytics.talentPoolSize, lbl: 'Saved workers' },
  ];

  return (
    <DashShell variant="business"
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Analytics"
      user={user}
      topTitle="Analytics"
      topSub="Performance overview for your business"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="dash-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {cards.map((c) => (
            <div className="dash-stat" key={c.lbl}>
              <div className="ds-top">
                <div className="ds-ico">
                  <Icon name={c.icon} size={20} />
                </div>
              </div>
              <div className="ds-num">{c.num}</div>
              <div className="ds-lbl">{c.lbl}</div>
            </div>
          ))}
        </div>

        <div className="panel panel-body">
          <h3 style={{ margin: '0 0 16px', fontWeight: 900 }}>Shift breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>{analytics.openShifts}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Open</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{analytics.filledShifts}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Filled</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{analytics.completedShifts}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>
                {Number(business.rating_avg).toFixed(1)}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Avg rating</div>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

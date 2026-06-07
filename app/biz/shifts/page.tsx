import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getBusinessShifts, getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile } from '@/lib/queries/users';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPayHour, formatShiftDate, formatTimeRange } from '@/lib/utils';

export default async function BizShiftsPage() {
  const session = await requireRole(['business']);
  const [stats, business, shifts] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
    getBusinessShifts(session.userId),
  ]);

  if (!business) return null;
  const user = businessDashUser(business);
  const supabase = createAdminClient();

  const withCounts = await Promise.all(
    shifts.map(async (shift) => {
      const { count } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('shift_id', shift.id);
      return { ...shift, totalApps: count ?? 0 };
    }),
  );

  return (
    <DashShell
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Manage Shifts"
      user={user}
      topTitle="Manage shifts"
      topSub={`${shifts.length} total shifts posted`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="section-title-row">
          <h2>All shifts</h2>
          <Link className="btn btn-primary" href="/biz/shifts/new">
            <Icon name="plus" size={17} /> Post shift
          </Link>
        </div>
        <div className="listing-grid" style={{ marginTop: 14 }}>
          {withCounts.map((s) => (
            <div className="listing" key={s.id}>
              <div className="l-top">
                <div>
                  <div className="l-title">{s.title}</div>
                  <div className="l-sub">
                    {formatShiftDate(s.shift_date)} · {formatTimeRange(s.start_time, s.end_time)}
                  </div>
                </div>
                <span className={`badge badge-${s.status === 'open' ? 'open' : s.status === 'cancelled' ? 'filled' : 'filled'}`}>
                  {s.status}
                </span>
              </div>
              <div className="l-meta">
                <span>{formatPayHour(s.pay_per_hour_cents)}/hr · {s.district}</span>
                <span>{s.totalApps} applications</span>
              </div>
              <div className="l-foot">
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {s.workers_confirmed}/{s.workers_needed} confirmed
                </span>
                <Link className="btn btn-sm btn-outline" href={`/biz/shifts/${s.id}`}>
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}

import Link from 'next/link';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getBusinessShifts, getDashboardStats } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPayHour, formatShiftDate, formatTimeRange } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function BizShiftsPage() {
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, shifts] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessShifts(session.userId),
  ]);

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
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Manage Shifts"
      user={user}
      topTitle="Manage shifts"
      topSub={`${shifts.length} total shifts posted`}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-black text-xl text-ink">All shifts</h2>
          <Link
            className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
            href="/biz/shifts/new"
          >
            <Icon name="plus" size={17} /> Post shift
          </Link>
        </div>

        {withCounts.length === 0 ? (
          <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">No shifts posted yet.</p>
            <Link
              href="/biz/shifts/new"
              className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              <Icon name="plus" size={16} /> Post your first shift
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {withCounts.map((s) => (
              <article
                key={s.id}
                className="bg-card border border-line rounded-2xl p-5 hover:border-brand transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="font-black text-ink truncate">{s.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {formatShiftDate(s.shift_date)} · {formatTimeRange(s.start_time, s.end_time)}
                    </div>
                  </div>
                  <span
                    className={`badge shrink-0 ${
                      s.status === 'open' ? 'badge-open' : 'badge-filled'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <span className="font-semibold text-ink">{formatPayHour(s.pay_per_hour_cents)}/hr</span>
                  <span>{s.district}</span>
                  <span>{s.totalApps} applications</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-line gap-3">
                  <span className="text-sm text-muted-foreground">
                    {s.workers_confirmed}/{s.workers_needed} confirmed
                  </span>
                  <Link
                    className="border border-line px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted/40 transition-colors"
                    href={`/biz/shifts/${s.id}`}
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashShell>
  );
}

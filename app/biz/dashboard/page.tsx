import Link from 'next/link';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getBusinessShifts, getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile } from '@/lib/queries/users';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPayHour, formatTimeRange, formatShiftDate } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

export default async function BizDashboardPage() {
  const session = await requireRole(['business']);
  const [stats, business, shifts] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
    getBusinessShifts(session.userId, { status: ['open', 'filled'], limit: 6 }),
  ]);

  if (!business) {
    return <div className="center-page">Business profile not found.</div>;
  }

  const user = businessDashUser(business);
  const supabase = createAdminClient();

  const listings = await Promise.all(
    shifts.map(async (shift) => {
      const { count } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('shift_id', shift.id)
        .eq('status', 'pending');
      return { ...shift, applicantCount: count ?? 0 };
    }),
  );

  return (
    <DashShell
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Overview"
      user={user}
      topTitle={`Welcome, ${business.business_name}`}
      topSub={
        business.verified
          ? 'Your dashboard at a glance'
          : 'Pending verification — you cannot post shifts yet'
      }
      notif={stats.unreadNotifications}
    >
      <div className="content">
        {!business.verified && (
          <div className="panel panel-body" style={{ background: 'var(--amber-tint)', borderColor: 'var(--amber)' }}>
            <strong>Account pending verification</strong>
            <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
              Our team is reviewing your business. You&apos;ll be notified once approved.
            </p>
          </div>
        )}

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="briefcase" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.openShifts ?? 0}</div>
            <div className="ds-lbl">Open shifts</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="users" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.pendingReview ?? 0}</div>
            <div className="ds-lbl">Applicants to review</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="check" size={20} />
              </div>
            </div>
            <div className="ds-num">{stats.filledShifts ?? 0}</div>
            <div className="ds-lbl">Filled shifts</div>
          </div>
          <div className="dash-stat">
            <div className="ds-top">
              <div className="ds-ico">
                <Icon name="star" size={20} />
              </div>
            </div>
            <div className="ds-num">{Number(stats.ratingAvg ?? 0).toFixed(1)}</div>
            <div className="ds-lbl">Rating</div>
          </div>
        </div>

        <section>
          <div className="section-title-row">
            <h2>Active shift listings</h2>
            <Link className="btn btn-primary" href="/biz/shifts/new">
              <Icon name="plus" size={17} /> Post New Shift
            </Link>
          </div>
          <div className="listing-grid" style={{ marginTop: 14 }}>
            {listings.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <h3>No active shifts</h3>
                <Link href="/biz/shifts/new" className="btn btn-primary">
                  Post your first shift
                </Link>
              </div>
            ) : (
              listings.map((l) => (
                <div className="listing" key={l.id}>
                  <div className="l-top">
                    <div>
                      <div className="l-title">{l.title}</div>
                      <div className="l-sub">
                        {formatShiftDate(l.shift_date)} · {formatTimeRange(l.start_time, l.end_time)} ·{' '}
                        {formatPayHour(l.pay_per_hour_cents)}/hr
                      </div>
                    </div>
                    <span
                      className={`badge ${l.is_urgent ? 'badge-urgent' : l.status === 'filled' ? 'badge-filled' : 'badge-open'}`}
                    >
                      {l.status}
                    </span>
                  </div>
                  <div className="l-meta">
                    <span>
                      <Icon name="pin" size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                      <b>{l.district}</b>
                    </span>
                    <span>Posted {formatDistanceToNow(parseISO(l.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="l-foot">
                    <span style={{ fontSize: 13.5, color: 'var(--muted)', fontWeight: 600 }}>
                      {l.applicantCount} pending applicant{l.applicantCount !== 1 ? 's' : ''}
                    </span>
                    <Link className="btn btn-sm btn-outline" href={`/biz/shifts/${l.id}`}>
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </DashShell>
  );
}

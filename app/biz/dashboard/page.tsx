import Link from 'next/link';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Star,
  Users,
} from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { DashShell } from '@/components/layout/DashShell';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { getBusinessShifts, getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile } from '@/lib/queries/users';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPayHour, formatShiftDate, formatTimeRange } from '@/lib/utils';

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

  const statCards = [
    { icon: Briefcase, label: 'Open shifts', value: stats.openShifts ?? 0 },
    { icon: Users, label: 'Applicants to review', value: stats.pendingReview ?? 0 },
    { icon: CheckCircle2, label: 'Filled shifts', value: stats.filledShifts ?? 0 },
    { icon: Star, label: 'Your rating', value: Number(stats.ratingAvg ?? 0).toFixed(1) },
  ];

  return (
    <DashShell
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Overview"
      user={user}
      topTitle={business.business_name}
      topSub="Staff up in minutes — your command centre"
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card rounded-2xl border border-line p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-sora text-3xl font-bold tracking-tight">{value}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <section className="bg-card rounded-2xl border border-line p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                Quick action
              </div>
              <h2 className="font-sora text-xl font-bold">Need cover tonight?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Post a shift and start receiving applications in minutes.
              </p>
            </div>
            <Link
              href="/biz/shifts/new"
              className="inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-xl font-sora font-bold text-sm uppercase tracking-wider hover:bg-brand-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Post a Shift
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4 gap-4">
            <div>
              <h2 className="font-sora text-xl font-bold">Active listings</h2>
              <p className="text-sm text-muted-foreground">{listings.length} open or filled</p>
            </div>
            <Link
              href="/biz/shifts"
              className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed border-line p-12 text-center">
              <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-sora font-bold text-lg mb-2">No active shifts yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Post your first shift to start receiving applications from verified students.
              </p>
              <Link
                href="/biz/shifts/new"
                className="inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark"
              >
                <Plus className="w-4 h-4" /> Post your first shift
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {listings.map((l) => (
                <article
                  key={l.id}
                  className="bg-card rounded-2xl border border-line p-5 hover:border-brand hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-sora font-bold truncate">{l.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatShiftDate(l.shift_date)} · {formatTimeRange(l.start_time, l.end_time)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                        l.status === 'filled'
                          ? 'bg-muted text-muted-foreground'
                          : l.is_urgent
                            ? 'bg-brand text-white'
                            : 'bg-brand-light text-brand'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-ink">{formatPayHour(l.pay_per_hour_cents)}/hr</span>
                    <span>{l.district}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(parseISO(l.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-line gap-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {l.applicantCount} pending applicant{l.applicantCount !== 1 ? 's' : ''}
                    </span>
                    <Link
                      href={`/biz/shifts/${l.id}`}
                      className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1"
                    >
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {(stats.pendingReview ?? 0) > 0 && (
          <section className="bg-ink text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                Action needed
              </p>
              <h3 className="font-sora text-xl font-bold">
                {stats.pendingReview} applicant{(stats.pendingReview ?? 0) !== 1 ? 's' : ''} waiting
              </h3>
            </div>
            <Link
              href="/biz/applicants"
              className="bg-brand hover:bg-brand-dark px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors"
            >
              Review now
            </Link>
          </section>
        )}
      </div>
    </DashShell>
  );
}

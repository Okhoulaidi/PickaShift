'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Euro,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { ShiftMap } from '@/components/map/ShiftMap';
import { useToast } from '@/components/ui/Toast';
import { applyToShift } from '@/lib/actions/applications';
import { studentNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats, ShiftWithBusiness } from '@/lib/types';
import { formatPay, formatPayHour, formatShiftDate, formatTimeRange } from '@/lib/utils';

interface UpcomingItem {
  id: string;
  title: string;
  businessName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  district: string;
}

interface StudentDashboardClientProps {
  user: DashUser;
  stats: DashboardStats;
  nearbyShifts: ShiftWithBusiness[];
  upcoming: UpcomingItem[];
  appliedIds: string[];
  firstName: string;
  district: string;
  hasCv?: boolean;
  skillsCount?: number;
}

export function StudentDashboardClient({
  user,
  stats,
  nearbyShifts,
  upcoming,
  appliedIds,
  firstName,
  district,
  hasCv = false,
  skillsCount = 0,
}: StudentDashboardClientProps) {
  const [applied, setApplied] = useState<Set<string>>(new Set(appliedIds));
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();

  const checklist = [
    { label: 'Create your account', done: true },
    { label: 'Upload your CV', done: hasCv },
    { label: 'Add your skills', done: skillsCount >= 3 },
    { label: 'Apply to your first shift', done: (stats.pendingApplications ?? 0) > 0 || (stats.completedShifts ?? 0) > 0 },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  async function handleApply(shiftId: string, businessName: string) {
    if (applied.has(shiftId) || loading) return;
    setLoading(shiftId);
    const result = await applyToShift(shiftId);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setApplied((prev) => new Set(prev).add(shiftId));
    show(`Applied to ${businessName}!`);
  }

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Home"
      user={user}
      topTitle={`Hey ${firstName} 👋`}
      topSub={`${nearbyShifts.length} open shifts near ${district || 'you'} today`}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {pct < 100 && (
          <section className="bg-card rounded-2xl border border-line p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Get started
                </div>
                <h2 className="font-sora text-xl font-bold">
                  Finish your profile to start getting matched
                </h2>
              </div>
              <div className="text-right shrink-0">
                <div className="font-sora text-3xl font-bold text-brand">{pct}%</div>
                <div className="text-xs text-muted-foreground">complete</div>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-5">
              <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {checklist.map((step) => (
                <li
                  key={step.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                    step.done
                      ? 'border-line bg-muted/30 text-muted-foreground'
                      : 'border-line bg-card hover:border-brand'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${step.done ? 'line-through' : 'font-medium'}`}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between mb-4 gap-4">
            <div>
              <h2 className="font-sora text-xl font-bold">Available shifts near you</h2>
              <p className="text-sm text-muted-foreground">
                {nearbyShifts.length} open in {district || 'Madrid'}
              </p>
            </div>
            <Link
              href="/browse"
              className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1 shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyShifts.slice(0, 6).map((s) => {
              const isApplied = applied.has(s.id);
              return (
                <article
                  key={s.id}
                  className="bg-card rounded-2xl border border-line p-5 hover:border-brand hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <h3 className="font-sora font-bold text-base leading-tight truncate">{s.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{s.business.business_name}</p>
                    </div>
                    <span className="shrink-0 bg-brand-light text-brand font-sora font-bold px-2.5 py-1 rounded-lg text-sm">
                      {formatPayHour(s.pay_per_hour_cents)}/hr
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {s.district}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {formatShiftDate(s.shift_date)} ·{' '}
                      {formatTimeRange(s.start_time, s.end_time)}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isApplied || loading === s.id}
                    onClick={() => handleApply(s.id, s.business.business_name)}
                    className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      isApplied
                        ? 'bg-muted text-muted-foreground cursor-default'
                        : 'bg-brand text-white hover:bg-brand-dark'
                    }`}
                  >
                    {isApplied ? 'Applied' : loading === s.id ? 'Applying…' : 'Apply'}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-line p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold">My upcoming shifts</h3>
              <span className="text-xs text-muted-foreground">{upcoming.length} confirmed</span>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-10 px-4 border-2 border-dashed border-line rounded-xl">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">You don&apos;t have any shifts yet</p>
                <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  Browse openings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((u) => (
                  <li key={u.id} className="p-3 rounded-xl border border-line">
                    <div className="font-semibold text-sm">{u.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{u.businessName}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-line p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold">Earnings this month</h3>
              <Euro className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="font-sora text-4xl font-bold mb-1">{formatPay(stats.totalEarnedCents ?? 0)}</div>
            <p className="text-sm text-muted-foreground mb-4">
              {stats.completedShifts ?? 0} completed shift{(stats.completedShifts ?? 0) !== 1 ? 's' : ''}
            </p>
            {district && (
              <div className="mt-4 rounded-xl overflow-hidden border border-line">
                <ShiftMap shifts={nearbyShifts} height={160} />
              </div>
            )}
          </div>
        </section>
      </div>
    </DashShell>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { ShiftMap } from '@/components/map/ShiftMap';
import { ShiftCard } from '@/components/shift/ShiftCard';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { applyToShift } from '@/lib/actions/applications';
import { studentNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import type { ShiftWithBusiness } from '@/lib/types';
import {
  formatPay,
  formatShiftDate,
  formatTimeRange,
  bizColor,
  initials,
} from '@/lib/utils';
import { format, parseISO } from 'date-fns';

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
}

function DashStat({
  icon,
  num,
  lbl,
}: {
  icon: 'check' | 'clock' | 'euro' | 'gauge';
  num: string;
  lbl: string;
}) {
  return (
    <div className="dash-stat">
      <div className="ds-top">
        <div className="ds-ico">
          <Icon name={icon} size={20} />
        </div>
      </div>
      <div className="ds-num">{num}</div>
      <div className="ds-lbl">{lbl}</div>
    </div>
  );
}

export function StudentDashboardClient({
  user,
  stats,
  nearbyShifts,
  upcoming,
  appliedIds,
  firstName,
  district,
}: StudentDashboardClientProps) {
  const [applied, setApplied] = useState<Set<string>>(new Set(appliedIds));
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();

  const nav = studentNav(stats.pendingApplications ?? 0);

  async function handleApply(shift: ShiftWithBusiness) {
    if (applied.has(shift.id) || loading) return;
    setLoading(shift.id);
    const result = await applyToShift(shift.id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setApplied((prev) => new Set(prev).add(shift.id));
    show(`Applied to ${shift.business.business_name}!`);
  }

  return (
    <DashShell
      nav={nav}
      active="Home"
      user={user}
      topTitle={`Hey ${firstName} 👋`}
      topSub={`${stats.upcomingShifts ?? 0} upcoming shift${(stats.upcomingShifts ?? 0) !== 1 ? 's' : ''} · ${stats.completedShifts ?? 0} completed`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="dash-stats">
          <DashStat icon="check" num={String(stats.completedShifts ?? 0)} lbl="Shifts completed" />
          <DashStat icon="clock" num={String(stats.pendingApplications ?? 0)} lbl="Pending applications" />
          <DashStat icon="euro" num={formatPay(stats.totalEarnedCents ?? 0)} lbl="Total earned" />
          <DashStat icon="gauge" num={String(stats.upcomingShifts ?? 0)} lbl="Upcoming shifts" />
        </div>

        <section>
          <div className="section-title-row">
            <h2>Available shifts near you</h2>
            <Link className="link-btn" href="/browse">
              View all <Icon name="chevright" size={15} />
            </Link>
          </div>
          <div className="h-scroll">
            {nearbyShifts.map((s) => (
              <ShiftCard
                key={s.id}
                shift={s}
                applied={applied.has(s.id)}
                onApply={handleApply}
              />
            ))}
          </div>
        </section>

        <div className="two-col">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>My upcoming shifts</h3>
                <div className="ph-sub">{upcoming.length} confirmed</div>
              </div>
              <Link className="link-btn" href="/dashboard/applications">
                View all <Icon name="chevright" size={15} />
              </Link>
            </div>
            <div className="panel-body" style={{ paddingTop: 6, paddingBottom: 8 }}>
              {upcoming.length === 0 ? (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>
                  No upcoming shifts. <Link href="/browse">Browse openings</Link>
                </p>
              ) : (
                <div className="up-list">
                  {upcoming.map((u) => {
                    const d = parseISO(u.shiftDate);
                    return (
                      <div className="up-item" key={u.id}>
                        <div className="up-date">
                          <div className="d">{format(d, 'dd')}</div>
                          <div className="m">{format(d, 'MMM')}</div>
                        </div>
                        <div className="up-info">
                          <div className="u-title">
                            {u.title} — {u.businessName}
                          </div>
                          <div className="u-meta">
                            <span>
                              <Icon name="clock" size={14} /> {formatShiftDate(u.shiftDate)} ·{' '}
                              {formatTimeRange(u.startTime, u.endTime)}
                            </span>
                            <span>
                              <Icon name="pin" size={14} /> {u.district}
                            </span>
                          </div>
                        </div>
                        <span className="badge badge-open">
                          <span className="badge-dot" />
                          Confirmed
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Shifts near {district || 'you'}</h3>
                <div className="ph-sub">{nearbyShifts.length} open nearby</div>
              </div>
            </div>
            <div className="panel-body">
              <ShiftMap shifts={nearbyShifts} height={200} />
              <Link className="btn btn-light btn-block" style={{ marginTop: 14 }} href="/browse">
                <Icon name="search" size={17} /> Open full map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

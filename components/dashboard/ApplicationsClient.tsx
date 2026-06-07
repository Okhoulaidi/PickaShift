'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import {
  formatPayHour,
  formatShiftDate,
  formatTimeRange,
  bizColor,
  initials,
} from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

type Tab = 'pending' | 'confirmed' | 'completed';

interface AppRow {
  id: string;
  status: string;
  appliedAt: string;
  title: string;
  businessName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  district: string;
  payCents: number;
}

export function ApplicationsClient({
  user,
  stats,
  pending,
  confirmed,
  completed,
}: {
  user: DashUser;
  stats: DashboardStats;
  pending: AppRow[];
  confirmed: AppRow[];
  completed: AppRow[];
}) {
  const [tab, setTab] = useState<Tab>('pending');
  const lists = { pending, confirmed, completed };
  const items = lists[tab];

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="My Applications"
      user={user}
      topTitle="My applications"
      topSub="Track pending, confirmed and completed shifts"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="tabs">
          {(['pending', 'confirmed', 'completed'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} ({lists[t].length})
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="empty-state panel">
            <h3>No {tab} applications</h3>
            <p>
              {tab === 'pending' ? (
                <>
                  <Link href="/browse">Browse shifts</Link> to start applying.
                </>
              ) : (
                'Nothing here yet.'
              )}
            </p>
          </div>
        ) : (
          <div className="panel">
            <div className="up-list" style={{ padding: '0 22px' }}>
              {items.map((app) => {
                const color = bizColor(app.businessName);
                return (
                  <div className="up-item" key={app.id}>
                    <div className="biz-logo" style={{ background: color, width: 44, height: 44 }}>
                      {initials(app.businessName)}
                    </div>
                    <div className="up-info">
                      <div className="u-title">
                        {app.title} — {app.businessName}
                      </div>
                      <div className="u-meta">
                        <span>
                          <Icon name="calendar" size={14} /> {formatShiftDate(app.shiftDate)} ·{' '}
                          {formatTimeRange(app.startTime, app.endTime)}
                        </span>
                        <span>
                          <Icon name="pin" size={14} /> {app.district}
                        </span>
                        <span>
                          <Icon name="euro" size={14} /> {formatPayHour(app.payCents)}/hr
                        </span>
                      </div>
                    </div>
                    <span
                      className={`badge ${tab === 'pending' ? 'badge-soft' : tab === 'confirmed' ? 'badge-open' : 'badge-filled'}`}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashShell>
  );
}

export function mapApplications(apps: Awaited<ReturnType<typeof import('@/lib/queries/shifts').getStudentApplications>>): AppRow[] {
  return apps.map((app) => {
    const shift = unwrapRelation(app.shift);
    const biz = shift ? unwrapRelation(shift.business) : null;
    return {
      id: app.id,
      status: app.status,
      appliedAt: app.applied_at,
      title: shift?.title ?? 'Shift',
      businessName: biz?.business_name ?? 'Business',
      shiftDate: shift?.shift_date ?? '',
      startTime: shift?.start_time ?? '',
      endTime: shift?.end_time ?? '',
      district: shift?.district ?? '',
      payCents: shift?.pay_per_hour_cents ?? 0,
    };
  });
}

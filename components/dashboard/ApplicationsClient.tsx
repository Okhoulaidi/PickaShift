'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import type { ApplicationRow } from '@/lib/applications-display';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import {
  formatPayHour,
  formatShiftDate,
  formatTimeRange,
  bizColor,
  initials,
} from '@/lib/utils';
import { format, parseISO } from 'date-fns';

function applicationStatusLabel(status: string): string {
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'no_show') return 'No show';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type Tab = 'pending' | 'confirmed' | 'completed';

export function ApplicationsClient({
  user,
  stats,
  pending,
  confirmed,
  completed,
}: {
  user: DashUser;
  stats: DashboardStats;
  pending: ApplicationRow[];
  confirmed: ApplicationRow[];
  completed: ApplicationRow[];
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
                const appliedLabel = app.appliedAt
                  ? format(parseISO(app.appliedAt), 'd MMM yyyy')
                  : '';
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
                        {appliedLabel && (
                          <span>
                            <Icon name="clock" size={14} /> Applied {appliedLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`badge ${tab === 'pending' ? 'badge-soft' : tab === 'confirmed' ? 'badge-open' : 'badge-filled'}`}
                    >
                      {applicationStatusLabel(app.status)}
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

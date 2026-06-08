'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { withdrawApplication } from '@/lib/actions/applications';
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

type Tab = 'pending' | 'confirmed' | 'completed' | 'closed';

const TAB_LABELS: Record<Tab, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  closed: 'Closed',
};

function emptyStateCopy(tab: Tab): { title: string; body: ReactNode } {
  switch (tab) {
    case 'pending':
      return {
        title: 'No pending applications',
        body: (
          <>
            <Link href="/browse">Browse shifts</Link> to start applying.
          </>
        ),
      };
    case 'confirmed':
      return { title: 'No confirmed applications', body: 'Nothing here yet.' };
    case 'completed':
      return { title: 'No completed shifts yet', body: 'Nothing here yet.' };
    case 'closed':
      return { title: 'No closed applications', body: 'Nothing here yet.' };
  }
}

export function ApplicationsClient({
  user,
  stats,
  pending: initialPending,
  confirmed,
  completed,
  closed,
}: {
  user: DashUser;
  stats: DashboardStats;
  pending: ApplicationRow[];
  confirmed: ApplicationRow[];
  completed: ApplicationRow[];
  closed: ApplicationRow[];
}) {
  const [tab, setTab] = useState<Tab>('pending');
  const [pending, setPending] = useState(initialPending);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter();

  const lists = { pending, confirmed, completed, closed };
  const items = lists[tab];
  const empty = emptyStateCopy(tab);

  async function handleWithdraw(applicationId: string) {
    setWithdrawingId(applicationId);
    const result = await withdrawApplication(applicationId);
    setWithdrawingId(null);

    if (result.error) {
      show(result.error);
      return;
    }

    setPending((prev) => prev.filter((a) => a.id !== applicationId));
    router.refresh();
  }

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="My Applications"
      user={user}
      topTitle="My applications"
      topSub="Track pending, confirmed, completed and closed shifts"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <div className="tabs">
          {(['pending', 'confirmed', 'completed', 'closed'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]} ({lists[t].length})
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="empty-state panel">
            <h3>{empty.title}</h3>
            <p>{empty.body}</p>
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
                    <div className="flex items-center gap-2 shrink-0">
                      {tab === 'pending' && app.status === 'pending' && (
                        <button
                          type="button"
                          className="border border-line px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
                          disabled={withdrawingId === app.id}
                          onClick={() => void handleWithdraw(app.id)}
                        >
                          {withdrawingId === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                      <span
                        className={`badge ${tab === 'pending' ? 'badge-soft' : tab === 'confirmed' ? 'badge-open' : 'badge-filled'}`}
                      >
                        {applicationStatusLabel(app.status)}
                      </span>
                    </div>
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

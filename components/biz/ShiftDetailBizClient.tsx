'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import {
  acceptApplication,
  rejectApplication,
  completeApplication,
} from '@/lib/actions/applications';
import { addToTalentPool } from '@/lib/actions/talent-pool';
import { cancelShift } from '@/lib/actions/shifts';
import { businessNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import { bizColor, formatPayHour, formatShiftDate, formatTimeRange, initials } from '@/lib/utils';

interface Applicant {
  id: string;
  status: string;
  studentId: string;
  name: string;
  sub: string;
  score: number;
  skills: string[];
}

interface ShiftDetailBizClientProps {
  user: DashUser;
  stats: DashboardStats;
  shift: {
    id: string;
    title: string;
    description: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
    district: string;
    payCents: number;
    status: string;
    workersConfirmed: number;
    workersNeeded: number;
  };
  applicants: Applicant[];
}

export function ShiftDetailBizClient({ user, stats, shift, applicants }: ShiftDetailBizClientProps) {
  const tNav = useTranslations('nav.business');
  const [apps, setApps] = useState(applicants);
  const [shiftStatus, setShiftStatus] = useState(shift.status);
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter();

  async function handleAccept(id: string) {
    setLoading(id);
    const result = await acceptApplication(id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a)));
    show('Applicant accepted');
    router.refresh();
  }

  async function handleReject(id: string) {
    setLoading(id);
    const result = await rejectApplication(id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    show('Applicant declined');
  }

  async function handleComplete(id: string) {
    setLoading(id);
    const result = await completeApplication(id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)));
    show('Shift marked complete');
    router.refresh();
  }

  async function handlePool(studentId: string) {
    setLoading(`pool-${studentId}`);
    const result = await addToTalentPool(studentId);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    show('Added to talent pool');
  }

  async function handleCancel() {
    if (!confirm('Cancel this shift? Accepted workers will be notified.')) return;
    setLoading('cancel');
    const result = await cancelShift(shift.id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setShiftStatus('cancelled');
    show('Shift cancelled');
  }

  return (
    <DashShell variant="business"
      nav={businessNav(tNav, stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active={tNav('manageShifts')}
      user={user}
      topTitle={shift.title}
      topSub={`${formatShiftDate(shift.shiftDate)} · ${formatTimeRange(shift.startTime, shift.endTime)}`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <Link href="/biz/shifts" className="link-btn" style={{ marginBottom: 8, display: 'inline-flex' }}>
          <Icon name="chevleft" size={15} /> All shifts
        </Link>

        <div className="panel panel-body" style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 12px' }}>{shift.description}</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14 }}>
            <span>
              <Icon name="pin" size={14} /> {shift.district}
            </span>
            <span>
              <Icon name="euro" size={14} /> {formatPayHour(shift.payCents)}/hr
            </span>
            <span>
              <Icon name="users" size={14} /> {shift.workersConfirmed}/{shift.workersNeeded} confirmed
            </span>
            <span className={`badge badge-${shiftStatus === 'open' ? 'open' : 'filled'}`}>{shiftStatus}</span>
          </div>
          {shiftStatus === 'open' && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 16 }}
              disabled={loading === 'cancel'}
              onClick={handleCancel}
            >
              Cancel shift
            </button>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Applicants</h3>
              <div className="ph-sub">Ranked by reliability score</div>
            </div>
          </div>
          {apps.length === 0 ? (
            <div className="panel-body empty-state">
              <p>No applications yet.</p>
            </div>
          ) : (
            <>
              <div className="appl-head">
                <span>Worker</span>
                <span>Score</span>
                <span className="appl-col-avail">Skills</span>
                <span />
              </div>
              {apps.map((a) => {
                const color = bizColor(a.name);
                const scorePct = Math.min(100, Math.round((a.score / 5) * 100));
                return (
                  <div className="appl-row" key={a.id}>
                    <div className="appl-person">
                      <span className="avatar md" style={{ background: color }}>
                        {initials(a.name)}
                      </span>
                      <div>
                        <div className="ap-name">{a.name}</div>
                        <div className="ap-sub">{a.sub}</div>
                      </div>
                    </div>
                    <div className="score">
                      <span>{a.score.toFixed(1)}</span>
                      <span className="bar">
                        <i style={{ width: `${scorePct}%` }} />
                      </span>
                    </div>
                    <div className="appl-col-avail" style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {a.skills.slice(0, 3).join(', ') || '—'}
                    </div>
                    <div className="appl-actions">
                      {a.status === 'accepted' && (
                        <>
                          <span className="badge badge-open">
                            <Icon name="check" size={12} /> Accepted
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={loading === a.id}
                            onClick={() => handleComplete(a.id)}
                          >
                            Complete
                          </button>
                        </>
                      )}
                      {a.status === 'rejected' && <span className="badge badge-filled">Declined</span>}
                      {a.status === 'completed' && <span className="badge badge-open">Completed</span>}
                      {a.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            disabled={loading === `pool-${a.studentId}`}
                            onClick={() => handlePool(a.studentId)}
                            title="Save to talent pool"
                          >
                            <Icon name="star" size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            disabled={loading === a.id}
                            onClick={() => handleReject(a.id)}
                          >
                            <Icon name="x" size={15} /> <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={loading === a.id}
                            onClick={() => handleAccept(a.id)}
                          >
                            <Icon name="check" size={15} /> <span>Accept</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </DashShell>
  );
}

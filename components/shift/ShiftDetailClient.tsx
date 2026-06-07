'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { applyToShift } from '@/lib/actions/applications';
import {
  estimatedTotal,
  formatPayHour,
  formatShiftDate,
  formatTimeRange,
  bizColor,
  initials,
} from '@/lib/utils';
import type { ShiftWithBusiness } from '@/lib/types';

export function ShiftDetailClient({
  shift,
  alreadyApplied,
}: {
  shift: ShiftWithBusiness;
  alreadyApplied: boolean;
}) {
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { show } = useToast();
  const biz = shift.business;
  const color = bizColor(biz.business_name);

  async function handleApply() {
    if (applied || loading) return;
    setLoading(true);
    const result = await applyToShift(shift.id);
    setLoading(false);

    if (result.error) {
      if (result.error === 'Unauthorized') {
        router.push(`/sign-in?redirect_url=/shifts/${shift.id}`);
        return;
      }
      show(result.error);
      return;
    }

    setApplied(true);
    show('Application submitted!');
  }

  return (
    <>
      <SiteHeader />
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <Link href="/browse" className="link-btn" style={{ marginBottom: 20, display: 'inline-flex' }}>
          <Icon name="chevleft" size={15} /> Back to browse
        </Link>

        <div className="shift-detail-grid">
          <div className="shift-detail-main">
            <div className="panel">
              <div className="panel-head">
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div className="biz-logo" style={{ background: color }}>
                    {initials(biz.business_name)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{shift.title}</h3>
                    <div className="ph-sub">{biz.business_name} · {biz.business_type}</div>
                  </div>
                </div>
                {shift.is_urgent && (
                  <span className="badge badge-urgent">
                    <Icon name="flame" size={12} fill /> Urgent
                  </span>
                )}
              </div>
              <div className="panel-body">
                <div className="shift-meta" style={{ marginBottom: 20 }}>
                  <div className="row">
                    <Icon name="calendar" size={16} /> {formatShiftDate(shift.shift_date)} ·{' '}
                    {formatTimeRange(shift.start_time, shift.end_time)}
                  </div>
                  <div className="row">
                    <Icon name="pin" size={16} /> {shift.district}, Madrid
                    {shift.address && ` · ${shift.address}`}
                  </div>
                </div>
                <h4 style={{ fontWeight: 800, margin: '0 0 10px' }}>About this shift</h4>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{shift.description}</p>
                {shift.skills_needed.length > 0 && (
                  <>
                    <h4 style={{ fontWeight: 800, margin: '24px 0 10px' }}>Skills needed</h4>
                    <div className="chips">
                      {shift.skills_needed.map((s) => (
                        <span key={s} className="chip on">
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className="detail-sidebar">
            <div className="panel">
              <div className="panel-body">
                <div className="pay" style={{ marginBottom: 20 }}>
                  <span className="amt">
                    {formatPayHour(shift.pay_per_hour_cents)}
                    <span className="per">/hr</span>
                  </span>
                  <span className="pay-lbl">
                    ≈ {estimatedTotal(shift.pay_per_hour_cents, shift.start_time, shift.end_time)} estimated
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn btn-block ${applied ? 'btn-light' : 'btn-primary'}`}
                  disabled={applied || loading || shift.status !== 'open'}
                  onClick={handleApply}
                >
                  {applied ? (
                    <>
                      <Icon name="check" size={16} /> Applied
                    </>
                  ) : shift.status !== 'open' ? (
                    'Not available'
                  ) : (
                    'Apply now'
                  )}
                </button>
                {biz.verified && (
                  <p style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, marginTop: 14, marginBottom: 0 }}>
                    <Icon name="check" size={14} /> Verified business
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

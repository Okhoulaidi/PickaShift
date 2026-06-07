'use client';

import { Icon } from '@/components/ui/Icon';
import type { ShiftWithBusiness } from '@/lib/types';
import {
  bizColor,
  estimatedTotal,
  formatPayHour,
  formatShiftDate,
  formatTimeRange,
  initials,
} from '@/lib/utils';

export interface ShiftCardProps {
  shift: ShiftWithBusiness;
  onApply?: (shift: ShiftWithBusiness) => void;
  applied?: boolean;
  compact?: boolean;
}

export function ShiftCard({ shift, onApply, applied = false, compact }: ShiftCardProps) {
  const bizName = shift.business.business_name;
  const color = bizColor(bizName);

  return (
    <article className="shift-card" data-compact={compact || undefined}>
      {shift.is_urgent && (
        <span className="corner-badge badge badge-urgent">
          <Icon name="flame" size={12} fill /> Urgent
        </span>
      )}
      <div className="shift-top">
        <div className="biz-logo" style={{ background: color }}>
          {initials(bizName)}
        </div>
        <div style={{ minWidth: 0, paddingRight: shift.is_urgent ? 70 : 0 }}>
          <div className="biz-name">{bizName}</div>
          <div className="biz-role">{shift.title}</div>
        </div>
      </div>
      <div className="shift-meta">
        <div className="row">
          <Icon name="calendar" size={16} /> {formatShiftDate(shift.shift_date)} ·{' '}
          {formatTimeRange(shift.start_time, shift.end_time)}
        </div>
        <div className="row">
          <Icon name="pin" size={16} /> {shift.district}, Madrid
        </div>
      </div>
      <div className="shift-foot">
        <div className="pay">
          <span className="amt">
            {formatPayHour(shift.pay_per_hour_cents)}
            <span className="per">/hr</span>
          </span>
          <span className="pay-lbl">
            ≈ {estimatedTotal(shift.pay_per_hour_cents, shift.start_time, shift.end_time)} for shift
          </span>
        </div>
        <button
          type="button"
          className={`btn btn-sm ${applied ? 'btn-light' : 'btn-primary'}`}
          onClick={() => onApply?.(shift)}
          disabled={applied}
        >
          {applied ? (
            <>
              <Icon name="check" size={15} /> Applied
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>
    </article>
  );
}

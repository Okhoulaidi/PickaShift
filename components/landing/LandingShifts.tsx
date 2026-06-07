'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShiftCard } from '@/components/shift/ShiftCard';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { applyToShift } from '@/lib/actions/applications';
import type { ShiftWithBusiness } from '@/lib/types';

export function LandingShifts({ shifts }: { shifts: ShiftWithBusiness[] }) {
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter();

  async function handleApply(shift: ShiftWithBusiness) {
    if (applied.has(shift.id) || loading) return;
    setLoading(shift.id);
    const result = await applyToShift(shift.id);
    setLoading(null);

    if (result.error) {
      if (result.error === 'Unauthorized') {
        router.push(`/sign-in?redirect_url=/shifts/${shift.id}`);
        return;
      }
      show(result.error);
      return;
    }

    setApplied((prev) => new Set(prev).add(shift.id));
    show(`Applied to ${shift.business.business_name} — good luck!`);
  }

  if (shifts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No open shifts right now</h3>
        <p>Check back soon — new shifts drop throughout the day.</p>
      </div>
    );
  }

  return (
    <>
      <div className="preview-grid">
        {shifts.slice(0, 3).map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            applied={applied.has(shift.id)}
            onApply={handleApply}
          />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 34 }}>
        <Link className="btn btn-primary btn-lg" href="/browse">
          See all open shifts <Icon name="chevright" size={17} />
        </Link>
      </div>
    </>
  );
}

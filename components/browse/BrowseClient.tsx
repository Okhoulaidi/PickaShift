'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { DashShell, type DashNavItem, type DashUser } from '@/components/layout/DashShell';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ShiftMap } from '@/components/map/ShiftMap';
import { ShiftCard } from '@/components/shift/ShiftCard';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { applyToShift } from '@/lib/actions/applications';
import { MADRID_DISTRICTS, SKILLS } from '@/lib/constants';
import type { ShiftWithBusiness } from '@/lib/types';

interface BrowseClientProps {
  shifts: ShiftWithBusiness[];
  appliedIds: string[];
  shell?: {
    user: DashUser;
    nav: DashNavItem[];
    notif: number;
  } | null;
}

function BrowseContent({
  shifts: initialShifts,
  appliedIds,
  embedded,
}: {
  shifts: ShiftWithBusiness[];
  appliedIds: string[];
  embedded: boolean;
}) {
  const t = useTranslations('browse');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { show } = useToast();
  const [, startTransition] = useTransition();

  const [applied, setApplied] = useState<Set<string>>(new Set(appliedIds));
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState<string | null>(null);

  const district = searchParams.get('district') ?? '';
  const urgentOnly = searchParams.get('urgent') === '1';
  const minPay = searchParams.get('minPay') ?? '';
  const skillFilter = searchParams.get('skill') ?? '';

  const filtered = useMemo(() => {
    return initialShifts.filter((s) => {
      if (district && s.district !== district) return false;
      if (urgentOnly && !s.is_urgent) return false;
      if (minPay && s.pay_per_hour_cents < Number(minPay) * 100) return false;
      if (skillFilter && !s.skills_needed.includes(skillFilter)) return false;
      return true;
    });
  }, [initialShifts, district, urgentOnly, minPay, skillFilter]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.push(`/browse?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  async function handleApply(shift: ShiftWithBusiness) {
    if (applied.has(shift.id) || loading) return;
    setLoading(shift.id);
    const result = await applyToShift(shift.id);
    setLoading(null);

    if (result.error) {
      if (result.error === 'Unauthorized') {
        router.push(`/sign-in?redirect_url=/browse`);
        return;
      }
      show(result.error);
      return;
    }

    setApplied((prev) => new Set(prev).add(shift.id));
    show(t('appliedToast', { business: shift.business.business_name }));
  }

  return (
    <div className={embedded ? 'content' : 'wrap'} style={embedded ? undefined : { paddingTop: 32, paddingBottom: 48 }}>
      {!embedded && (
        <>
          <h1 style={{ fontWeight: 900, fontSize: 32, margin: '0 0 8px', letterSpacing: '-.02em' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '0 0 28px' }}>
            {t('openShifts', { count: filtered.length })}
          </p>
        </>
      )}

      <div className="browse-layout">
        <aside className="filters-bar">
          <h3>{t('filters')}</h3>
          <div className="field">
            <label>{t('district')}</label>
            <select value={district} onChange={(e) => updateFilter('district', e.target.value)}>
              <option value="">{t('allDistricts')}</option>
              {MADRID_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{t('minPay')}</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={minPay}
              onChange={(e) => updateFilter('minPay', e.target.value)}
              placeholder={t('any')}
            />
          </div>
          <div className="field">
            <label>{t('skill')}</label>
            <select value={skillFilter} onChange={(e) => updateFilter('skill', e.target.value)}>
              <option value="">{t('anySkill')}</option>
              {SKILLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="check-row">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => updateFilter('urgent', e.target.checked ? '1' : '')}
              />
              <span>{t('urgentOnly')}</span>
            </label>
          </div>
        </aside>

        <div className="browse-main">
          <ShiftMap
            shifts={filtered}
            selectedId={selectedId}
            onSelect={(s) => setSelectedId(s.id)}
            height={280}
            className="shift-map"
          />
          <div className="shift-grid">
            {filtered.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                applied={applied.has(shift.id)}
                onApply={handleApply}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>{t('noResultsTitle')}</h3>
              <p>{t('noResultsBody')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BrowseClient({ shifts, appliedIds, shell }: BrowseClientProps) {
  const t = useTranslations('browse');
  const tNav = useTranslations('nav.student');

  const content = (
    <BrowseContent shifts={shifts} appliedIds={appliedIds} embedded={!!shell} />
  );

  if (shell) {
    return (
      <DashShell
        nav={shell.nav}
        active={tNav('browseShifts')}
        user={shell.user}
        topTitle={t('shellTitle')}
        topSub={t('shellSub', { count: shifts.length })}
        notif={shell.notif}
      >
        {content}
      </DashShell>
    );
  }

  return (
    <>
      <LandingNav />
      {content}
      <SiteFooter />
    </>
  );
}

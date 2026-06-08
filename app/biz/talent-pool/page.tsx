import { getTranslations } from 'next-intl/server';
import { DashShell } from '@/components/layout/DashShell';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getTalentPool } from '@/lib/queries/users';
import { bizColor, initials } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TalentPoolPage() {
  const t = await getTranslations('biz.talentPool');
  const tNav = await getTranslations('nav.business');
  const tCommon = await getTranslations('common');
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, pool] = await Promise.all([
    getDashboardStats('business', session.userId),
    getTalentPool(session.userId),
  ]);

  const user = businessDashUser(business);

  return (
    <DashShell
      variant="business"
      nav={businessNav(tNav, stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active={tNav('workerPool')}
      user={user}
      topTitle={t('title')}
      topSub={t('subtitle')}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {pool.length === 0 ? (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <h3 className="font-black text-lg mb-2">{t('emptyTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('emptyBody')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="divide-y divide-line">
              {pool.map((entry) => {
                const student = unwrapRelation(entry.student);
                const profile = student ? unwrapRelation(student.profile) : null;
                const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || tCommon('worker');
                const color = bizColor(name);
                return (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="avatar md" style={{ background: color }}>
                        {initials(name)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-ink">{name}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {student?.university} · {t('shifts', { count: student?.shifts_completed ?? 0 })} · {t('score')}{' '}
                          {Number(student?.reliability_score ?? 5).toFixed(1)}
                        </div>
                        {entry.note && (
                          <div className="text-sm text-muted-foreground mt-1">{entry.note}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground shrink-0 hidden sm:block max-w-[200px] truncate">
                      {(student?.skills ?? []).slice(0, 4).join(', ') || '—'}
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

import { getTranslations } from 'next-intl/server';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessAnalytics } from '@/lib/queries/users';

export const dynamic = 'force-dynamic';

export default async function BizAnalyticsPage() {
  const t = await getTranslations('biz.analytics');
  const tNav = await getTranslations('nav.business');
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, analytics] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessAnalytics(session.userId),
  ]);

  const user = businessDashUser(business);

  const cards = [
    { icon: 'briefcase' as const, num: analytics.totalShifts, lbl: t('totalShifts') },
    { icon: 'check' as const, num: analytics.completedShifts, lbl: t('completedShifts') },
    { icon: 'users' as const, num: analytics.totalApplications, lbl: t('totalApplications') },
    { icon: 'clipboard' as const, num: analytics.pendingApplications, lbl: t('pendingReview') },
    { icon: 'star' as const, num: analytics.acceptedApplications, lbl: t('acceptedWorkers') },
    { icon: 'layers' as const, num: analytics.talentPoolSize, lbl: t('savedWorkers') },
  ];

  return (
    <DashShell
      variant="business"
      nav={businessNav(tNav, stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active={tNav('analytics')}
      user={user}
      topTitle={t('title')}
      topSub={t('subtitle')}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.lbl} className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name={c.icon} size={20} />
              </div>
              <div className="text-2xl font-black text-ink">{c.num}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.lbl}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-line rounded-2xl p-6">
          <h3 className="font-black text-ink mb-4">{t('breakdown')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black text-green-600">{analytics.openShifts}</div>
              <div className="text-sm text-muted-foreground">{t('open')}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-ink">{analytics.filledShifts}</div>
              <div className="text-sm text-muted-foreground">{t('filled')}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-ink">{analytics.completedShifts}</div>
              <div className="text-sm text-muted-foreground">{t('completed')}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-brand">{Number(business.rating_avg).toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">{t('avgRating')}</div>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

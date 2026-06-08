import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getUserNotifications, markNotificationsRead } from '@/lib/queries/notifications';
import { getDashboardStats } from '@/lib/queries/shifts';

export const dynamic = 'force-dynamic';

export default async function BizNotificationsPage() {
  const t = await getTranslations('biz.notifications');
  const tNav = await getTranslations('nav.business');
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, notifications] = await Promise.all([
    getDashboardStats('business', session.userId),
    getUserNotifications(session.userId, 50),
  ]);

  const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
  void markNotificationsRead(session.userId, unreadIds);

  const user = businessDashUser(business);
  const pending = stats.pendingReview ?? 0;

  return (
    <DashShell
      variant="business"
      nav={businessNav(tNav, stats.openShifts ?? 0, pending)}
      active={tNav('overview')}
      user={user}
      topTitle={t('title')}
      topSub={t('subtitle')}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {notifications.length === 0 ? (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-4">
                  <Icon name="bell" size={26} />
                </div>
                <h3 className="font-black text-lg mb-2">{t('emptyTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-5">{t('emptyBody')}</p>
                <Link
                  href="/biz/shifts/new"
                  className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
                >
                  {t('postShift')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="divide-y divide-line px-6">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? '#'}
                  className={`flex py-4 no-underline text-inherit ${n.read_at ? '' : 'bg-brand/5 -mx-6 px-6'}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-ink">{n.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
                    <div className="text-xs text-muted-foreground mt-1.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashShell>
  );
}

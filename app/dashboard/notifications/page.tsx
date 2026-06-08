import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getUserNotifications, markNotificationsRead } from '@/lib/queries/notifications';
import { getDashboardStats } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const { session, profile: student } = await requireStudentProfile();
  const [stats, notifications] = await Promise.all([
    getDashboardStats('student', session.userId),
    getUserNotifications(session.userId, 50),
  ]);

  const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
  void markNotificationsRead(session.userId, unreadIds);

  const profile = unwrapRelation(student.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName ?? null,
      last_name: profile?.last_name ?? session.user.lastName ?? null,
    },
    student,
  );

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Home"
      user={user}
      topTitle="Notifications"
      topSub="Updates about your applications and shifts"
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
                <h3 className="font-black text-lg mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  When something happens on your applications, you&apos;ll see it here.
                </p>
                <Link
                  href="/browse"
                  className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
                >
                  Browse shifts
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

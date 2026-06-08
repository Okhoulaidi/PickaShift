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
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, pool] = await Promise.all([
    getDashboardStats('business', session.userId),
    getTalentPool(session.userId),
  ]);

  const user = businessDashUser(business);

  return (
    <DashShell
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Worker Pool"
      user={user}
      topTitle="Talent pool"
      topSub="Workers you've saved for future shifts"
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {pool.length === 0 ? (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <h3 className="font-black text-lg mb-2">No saved workers yet</h3>
              <p className="text-sm text-muted-foreground">
                Save great workers from completed shifts to hire them again faster.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="divide-y divide-line">
              {pool.map((entry) => {
                const student = unwrapRelation(entry.student);
                const profile = student ? unwrapRelation(student.profile) : null;
                const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Worker';
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
                          {student?.university} · {student?.shifts_completed} shifts · Score{' '}
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

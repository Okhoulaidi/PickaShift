import Link from 'next/link';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getDashboardStats, getStudentApplications } from '@/lib/queries/shifts';
import { formatPay, shiftHours } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EarningsPage() {
  const { session, profile: student } = await requireStudentProfile();
  const [stats, completedApps] = await Promise.all([
    getDashboardStats('student', session.userId),
    getStudentApplications(session.userId, 'completed'),
  ]);

  const profile = unwrapRelation(student.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  let totalHours = 0;
  for (const app of completedApps) {
    const shift = unwrapRelation(app.shift);
    if (shift) totalHours += shiftHours(shift.start_time, shift.end_time);
  }

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Earnings"
      user={user}
      topTitle="Earnings"
      topSub="Your shift income on Pick a Shift"
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-line rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
              <Icon name="euro" size={20} />
            </div>
            <div className="text-2xl font-black text-ink">{formatPay(stats.totalEarnedCents ?? 0)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Total earned</div>
          </div>
          <div className="bg-card border border-line rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
              <Icon name="check" size={20} />
            </div>
            <div className="text-2xl font-black text-ink">{stats.completedShifts ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Completed shifts</div>
          </div>
          <div className="bg-card border border-line rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
              <Icon name="clock" size={20} />
            </div>
            <div className="text-2xl font-black text-ink">{Math.round(totalHours)}h</div>
            <div className="text-xs text-muted-foreground mt-0.5">Hours worked</div>
          </div>
          <div className="bg-card border border-line rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
              <Icon name="gauge" size={20} />
            </div>
            <div className="text-2xl font-black text-ink">{Number(student.reliability_score ?? 5).toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Reliability score</div>
          </div>
        </div>

        <div className="bg-card border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h3 className="font-black text-ink">Recent completed shifts</h3>
          </div>
          <div className="p-6">
            {completedApps.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">
                No completed shifts yet. <Link href="/browse" className="text-brand font-semibold">Find your first shift</Link>
              </p>
            ) : (
              <div className="divide-y divide-line">
                {completedApps.slice(0, 10).map((app) => {
                  const shift = unwrapRelation(app.shift);
                  const biz = shift ? unwrapRelation(shift.business) : null;
                  const hours = shift ? shiftHours(shift.start_time, shift.end_time) : 0;
                  const earned = shift ? Math.round(shift.pay_per_hour_cents * hours) : 0;
                  return (
                    <div key={app.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div>
                        <div className="font-semibold text-sm text-ink">
                          {shift?.title} — {biz?.business_name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">{shift?.shift_date}</div>
                      </div>
                      <strong className="text-green-600 font-black">{formatPay(earned)}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

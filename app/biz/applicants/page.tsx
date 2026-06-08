import Link from 'next/link';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import { resolveCvDownloadUrl } from '@/lib/storage/cv';
import { unwrapRelation } from '@/lib/types';
import { bizColor, initials, formatShiftDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function BizApplicantsPage() {
  const { session, profile: business } = await requireBusinessProfile();
  const stats = await getDashboardStats('business', session.userId);

  const supabase = createAdminClient();

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, student_id,
      shift:shifts!inner(id, title, shift_date, district, business_id),
      student:students(id, university, degree, cv_url)
    `)
    .eq('shift.business_id', session.userId)
    .order('applied_at', { ascending: false });

  const studentIds = [...new Set((applications ?? []).map((app) => app.student_id))];
  const { data: profiles } = studentIds.length
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', studentIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const grouped: Record<string, NonNullable<typeof applications>> = {};
  for (const app of applications ?? []) {
    const shift = unwrapRelation(app.shift);
    if (!shift) continue;
    const key = shift.id as string;
    if (!grouped[key]) grouped[key] = [];
    grouped[key]!.push(app);
  }

  const cvUrlCache = new Map<string, string | null>();
  for (const app of applications ?? []) {
    const student = unwrapRelation(app.student);
    if (!student?.id || !student.cv_url || cvUrlCache.has(student.id)) continue;
    cvUrlCache.set(
      student.id,
      await resolveCvDownloadUrl(student.cv_url, student.id),
    );
  }

  const user = businessDashUser(business);
  const pending = (applications ?? []).filter((a) => a.status === 'pending').length;

  return (
    <DashShell
      variant="business"
      nav={businessNav(stats.openShifts ?? 0, pending)}
      active="Applicants"
      user={user}
      topTitle="Applicants"
      topSub="All applications across your shifts"
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-4">
                  <Icon name="clipboard" size={26} />
                </div>
                <h3 className="font-black text-lg mb-2">No applicants yet</h3>
                <p className="text-sm text-muted-foreground mb-5">Post a shift to start receiving applications.</p>
                <Link
                  href="/biz/shifts/new"
                  className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
                >
                  <Icon name="plus" size={16} /> Post a Shift
                </Link>
              </div>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([, apps]) => {
            const firstApp = apps![0];
            const shift = unwrapRelation(firstApp?.shift);
            if (!shift) return null;
            return (
              <div className="bg-card border border-line rounded-2xl overflow-hidden" key={shift.id as string}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-line gap-4">
                  <div>
                    <h3 className="font-black text-ink">{shift.title as string}</h3>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {formatShiftDate(shift.shift_date as string)} · {shift.district as string} · {apps!.length} applicant{apps!.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Link
                    href={`/biz/shifts/${shift.id}`}
                    className="border border-line px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted/40 transition-colors shrink-0"
                  >
                    Manage shift →
                  </Link>
                </div>
                <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-line text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span>Applicant</span>
                  <span>University</span>
                  <span>Status</span>
                  <span />
                </div>
                <div className="divide-y divide-line">
                  {apps!.map((app) => {
                    const student = unwrapRelation(app.student);
                    const profile = student?.id ? profileMap.get(student.id) : null;
                    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student';
                    const cvHref = student?.id ? cvUrlCache.get(student.id) : null;
                    return (
                      <div
                        key={app.id}
                        className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center gap-3 sm:gap-4 px-6 py-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="avatar md" style={{ background: bizColor(name) }}>
                            {initials(name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink">{name}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">{student?.degree ?? ''}</div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {student?.university?.replace(/\s*\([^)]*\)\s*/g, '').trim() ?? '—'}
                        </span>
                        <span
                          className={`badge w-fit ${
                            app.status === 'accepted' ? 'badge-open' :
                            app.status === 'rejected' ? 'badge-filled' :
                            'badge-soft'
                          }`}
                        >
                          {app.status}
                        </span>
                        <div className="flex items-center gap-2 sm:justify-end">
                          {cvHref && (
                            <a
                              href={cvHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 border border-line px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted/40 transition-colors"
                            >
                              <Icon name="file" size={14} /> CV
                            </a>
                          )}
                          <Link
                            href={`/biz/shifts/${shift.id}`}
                            className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-dark transition-colors"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashShell>
  );
}

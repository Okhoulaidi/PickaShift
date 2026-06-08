import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getDashboardStats } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`inline-flex ${i < score ? 'text-brand' : 'text-line'}`}>
          <Icon name="star" size={15} fill={i < score} />
        </span>
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const { session, profile: student } = await requireStudentProfile();
  const stats = await getDashboardStats('student', session.userId);
  const supabase = createAdminClient();

  const profile = unwrapRelation(student.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  const { data: ratings } = await supabase
    .from('ratings')
    .select('id, score, comment, created_at, shift:shifts(title, shift_date), rater:profiles!ratings_rater_id_fkey(first_name, last_name)')
    .eq('rated_id', session.userId)
    .order('created_at', { ascending: false });

  const avgScore = ratings?.length
    ? (ratings.reduce((s, r) => s + (r.score ?? 0), 0) / ratings.length).toFixed(1)
    : null;

  return (
    <DashShell
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="My Reviews"
      user={user}
      topTitle="My Reviews"
      topSub="Ratings left by businesses after completed shifts"
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {avgScore && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="star" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{avgScore}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Average rating</div>
            </div>
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="clipboard" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{ratings?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Total reviews</div>
            </div>
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="check" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">
                {ratings?.filter((r) => (r.score ?? 0) >= 4).length ?? 0}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">5★ or 4★ reviews</div>
            </div>
          </div>
        )}

        <div className="bg-card border border-line rounded-2xl overflow-hidden">
          {ratings && ratings.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h3 className="font-black text-ink">All reviews</h3>
              </div>
              <div className="divide-y divide-line">
                {ratings.map((r) => {
                  const rater = unwrapRelation(r.rater);
                  const shift = unwrapRelation(r.shift);
                  return (
                    <div key={r.id} className="flex flex-col gap-2 px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-black text-sm">
                          {rater?.first_name} {rater?.last_name}
                        </div>
                        <StarRating score={r.score ?? 0} />
                      </div>
                      {shift && (
                        <div className="text-sm text-muted-foreground">
                          {shift.title} · {shift.shift_date}
                        </div>
                      )}
                      {r.comment && (
                        <p className="text-sm text-ink leading-relaxed m-0">&ldquo;{r.comment}&rdquo;</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-4">
                  <Icon name="star" size={26} />
                </div>
                <h3 className="font-black text-lg mb-2">No reviews yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  After you complete a shift, businesses can leave you a review. Great shifts earn great scores.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashShell>
  );
}

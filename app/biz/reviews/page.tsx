import { getTranslations } from 'next-intl/server';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import { unwrapRelation } from '@/lib/types';
import { bizColor, initials } from '@/lib/utils';

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

function ReviewRow({
  name,
  shiftTitle,
  shiftDate,
  score,
  comment,
}: {
  name: string;
  shiftTitle?: string;
  shiftDate?: string;
  score: number;
  comment?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2 px-6 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="avatar sm" style={{ background: bizColor(name) }}>
            {initials(name)}
          </div>
          <span className="font-black text-sm">{name}</span>
        </div>
        <StarRating score={score} />
      </div>
      {shiftTitle && (
        <div className="text-sm text-muted-foreground">
          {shiftTitle} · {shiftDate}
        </div>
      )}
      {comment && <p className="text-sm leading-relaxed m-0">&ldquo;{comment}&rdquo;</p>}
    </div>
  );
}

export default async function BizReviewsPage() {
  const t = await getTranslations('biz.reviews');
  const tNav = await getTranslations('nav.business');
  const { session, profile: business } = await requireBusinessProfile();
  const stats = await getDashboardStats('business', session.userId);

  const supabase = createAdminClient();

  const { data: given } = await supabase
    .from('ratings')
    .select('id, score, comment, created_at, rated:profiles!ratings_rated_id_fkey(first_name, last_name), shift:shifts(title, shift_date)')
    .eq('rater_id', session.userId)
    .order('created_at', { ascending: false });

  const { data: received } = await supabase
    .from('ratings')
    .select('id, score, comment, created_at, rater:profiles!ratings_rater_id_fkey(first_name, last_name), shift:shifts(title, shift_date)')
    .eq('rated_id', session.userId)
    .order('created_at', { ascending: false });

  const user = businessDashUser(business);
  const avgReceived = received?.length
    ? (received.reduce((s, r) => s + (r.score ?? 0), 0) / received.length).toFixed(1)
    : null;

  return (
    <DashShell
      variant="business"
      nav={businessNav(tNav, stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active={tNav('reviews')}
      user={user}
      topTitle={t('title')}
      topSub={t('subtitle')}
      notif={stats.unreadNotifications}
    >
      <div className="space-y-6">
        {avgReceived && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="star" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{avgReceived}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('avgFromWorkers')}</div>
            </div>
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="users" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{received?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('reviewsReceived')}</div>
            </div>
            <div className="bg-card border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                <Icon name="clipboard" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{given?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('reviewsYouveGiven')}</div>
            </div>
          </div>
        )}

        <div className="bg-card border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h3 className="font-black text-ink">{t('receivedTitle')}</h3>
          </div>
          {received && received.length > 0 ? (
            <div className="divide-y divide-line">
              {received.map((r) => {
                const rater = unwrapRelation(r.rater);
                const shift = unwrapRelation(r.shift);
                const name = [rater?.first_name, rater?.last_name].filter(Boolean).join(' ') || 'Worker';
                return (
                  <ReviewRow
                    key={r.id}
                    name={name}
                    shiftTitle={shift?.title}
                    shiftDate={shift?.shift_date}
                    score={r.score ?? 0}
                    comment={r.comment}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <p className="text-sm text-muted-foreground">{t('emptyReceivedDetail')}</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h3 className="font-black text-ink">{t('givenTitle')}</h3>
          </div>
          {given && given.length > 0 ? (
            <div className="divide-y divide-line">
              {given.map((r) => {
                const rated = unwrapRelation(r.rated);
                const shift = unwrapRelation(r.shift);
                const name = [rated?.first_name, rated?.last_name].filter(Boolean).join(' ') || 'Worker';
                return (
                  <ReviewRow
                    key={r.id}
                    name={name}
                    shiftTitle={shift?.title}
                    shiftDate={shift?.shift_date}
                    score={r.score ?? 0}
                    comment={r.comment}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <p className="text-sm text-muted-foreground">{t('emptyGivenDetail')}</p>
            </div>
          )}
        </div>
      </div>
    </DashShell>
  );
}

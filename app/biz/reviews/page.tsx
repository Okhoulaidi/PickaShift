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

export default async function BizReviewsPage() {
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
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Reviews"
      user={user}
      topTitle="Reviews"
      topSub="Ratings you've given workers and received from them"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        {avgReceived && (
          <div className="dash-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="dash-stat">
              <div className="ds-top"><div className="ds-ico"><Icon name="star" size={18} /></div></div>
              <div className="ds-num">{avgReceived}</div>
              <div className="ds-lbl">Your avg rating from workers</div>
            </div>
            <div className="dash-stat">
              <div className="ds-top"><div className="ds-ico"><Icon name="users" size={18} /></div></div>
              <div className="ds-num">{received?.length ?? 0}</div>
              <div className="ds-lbl">Reviews received</div>
            </div>
            <div className="dash-stat">
              <div className="ds-top"><div className="ds-ico"><Icon name="clipboard" size={18} /></div></div>
              <div className="ds-num">{given?.length ?? 0}</div>
              <div className="ds-lbl">Reviews you&apos;ve given</div>
            </div>
          </div>
        )}

        <div className="panel">
          <div className="panel-head">
            <h3>Reviews from workers</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {received && received.length > 0 ? (
              received.map((r) => {
                const rater = unwrapRelation(r.rater);
                const shift = unwrapRelation(r.shift);
                const name = [rater?.first_name, rater?.last_name].filter(Boolean).join(' ') || 'Worker';
                return (
                  <div key={r.id} style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar sm" style={{ background: bizColor(name) }}>{initials(name)}</div>
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} name="star" size={15} fill={i < (r.score ?? 0)} style={{ color: i < (r.score ?? 0) ? 'var(--primary)' : 'var(--line-strong)' }} />
                        ))}
                      </div>
                    </div>
                    {shift && <div style={{ fontSize: 13, color: 'var(--muted)' }}>{shift.title} · {shift.shift_date}</div>}
                    {r.comment && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>&ldquo;{r.comment}&rdquo;</p>}
                  </div>
                );
              })
            ) : (
              <div className="empty-state" style={{ padding: '40px 24px' }}>
                <p>No reviews from workers yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Reviews you&apos;ve given</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {given && given.length > 0 ? (
              given.map((r) => {
                const rated = unwrapRelation(r.rated);
                const shift = unwrapRelation(r.shift);
                const name = [rated?.first_name, rated?.last_name].filter(Boolean).join(' ') || 'Worker';
                return (
                  <div key={r.id} style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar sm" style={{ background: bizColor(name) }}>{initials(name)}</div>
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} name="star" size={15} fill={i < (r.score ?? 0)} style={{ color: i < (r.score ?? 0) ? 'var(--primary)' : 'var(--line-strong)' }} />
                        ))}
                      </div>
                    </div>
                    {shift && <div style={{ fontSize: 13, color: 'var(--muted)' }}>{shift.title} · {shift.shift_date}</div>}
                    {r.comment && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>&ldquo;{r.comment}&rdquo;</p>}
                  </div>
                );
              })
            ) : (
              <div className="empty-state" style={{ padding: '40px 24px' }}>
                <p>You haven&apos;t reviewed any workers yet. Reviews appear after a shift is completed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

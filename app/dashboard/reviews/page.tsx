import { requireRole } from '@/lib/auth';
import { studentDashUser } from '@/lib/dashboard-user';
import { studentNav } from '@/lib/dashboard-nav';
import { DashShell } from '@/components/layout/DashShell';
import { createAdminClient } from '@/lib/supabase/admin';
import { Icon } from '@/components/ui/Icon';

export default async function ReviewsPage() {
  const session = await requireRole(['student']);
  const supabase = createAdminClient();

  const { data: student } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .eq('id', session.userId)
    .single();

  const profile = Array.isArray(student?.profile) ? student?.profile[0] : student?.profile;

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
    <DashShell nav={studentNav()} active="My Reviews" user={user} topTitle="My Reviews" topSub="Ratings left by businesses after completed shifts">
      <div className="content">
        {avgScore && (
          <div className="dash-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="dash-stat">
              <div className="ds-top">
                <div className="ds-ico"><Icon name="star" size={18} /></div>
              </div>
              <div className="ds-num">{avgScore}</div>
              <div className="ds-lbl">Average rating</div>
            </div>
            <div className="dash-stat">
              <div className="ds-top">
                <div className="ds-ico"><Icon name="clipboard" size={18} /></div>
              </div>
              <div className="ds-num">{ratings?.length ?? 0}</div>
              <div className="ds-lbl">Total reviews</div>
            </div>
            <div className="dash-stat">
              <div className="ds-top">
                <div className="ds-ico"><Icon name="check" size={18} /></div>
              </div>
              <div className="ds-num">
                {ratings?.filter((r) => (r.score ?? 0) >= 4).length ?? 0}
              </div>
              <div className="ds-lbl">5★ or 4★ reviews</div>
            </div>
          </div>
        )}

        <div className="panel">
          {ratings && ratings.length > 0 ? (
            <>
              <div className="panel-head">
                <h3>All reviews</h3>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>
                {ratings.map((r) => {
                  const rater = Array.isArray(r.rater) ? r.rater[0] : r.rater;
                  const shift = Array.isArray(r.shift) ? r.shift[0] : r.shift;
                  return (
                    <div key={r.id} style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>
                          {rater?.first_name} {rater?.last_name}
                        </div>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icon
                              key={i}
                              name="star"
                              size={15}
                              fill={i < (r.score ?? 0)}
                              style={{ color: i < (r.score ?? 0) ? 'var(--primary)' : 'var(--line-strong)' }}
                            />
                          ))}
                        </div>
                      </div>
                      {shift && (
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                          {shift.title} · {shift.shift_date}
                        </div>
                      )}
                      {r.comment && (
                        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.55 }}>
                          &ldquo;{r.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="panel-body">
              <div className="empty-state" style={{ padding: '64px 24px' }}>
                <span className="ds-ico" style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 16 }}>
                  <Icon name="star" size={26} />
                </span>
                <h3>No reviews yet</h3>
                <p style={{ marginTop: 8, maxWidth: 320 }}>
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

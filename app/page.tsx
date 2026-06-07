import Link from 'next/link';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { LandingShifts } from '@/components/landing/LandingShifts';
import { Icon } from '@/components/ui/Icon';
import { getOpenShifts, getPlatformStats } from '@/lib/queries/shifts';

const STUDENT_STEPS = [
  { n: 1, t: 'Create your profile', d: 'Add your availability, skills and a photo. Takes 2 minutes — no CV needed.' },
  { n: 2, t: 'Browse shifts near you', d: 'Filter by district, pay and time. See only shifts that fit between your classes.' },
  { n: 3, t: 'Work it & get paid', d: 'Show up, clock in, get paid within 24h straight to your account.' },
];

const BIZ_STEPS = [
  { n: 1, t: 'Post a shift', d: 'Title, time, pay and location. Live in under 60 seconds.' },
  { n: 2, t: 'Pick your workers', d: 'Review ranked applicants by reliability score and accept with one tap.' },
  { n: 3, t: 'Done', d: 'Your worker shows up. We handle payments, contracts and invoicing.' },
];

function StepCol({
  tag,
  title,
  steps,
  alt,
  cta,
  href,
}: {
  tag: string;
  title: string;
  steps: { n: number; t: string; d: string }[];
  alt?: boolean;
  cta: string;
  href: string;
}) {
  return (
    <div className={`howit-col${alt ? ' alt' : ''}`}>
      <div className="col-head">
        <span
          className="ds-ico"
          style={alt ? { background: 'var(--primary)', color: '#fff' } : undefined}
        >
          <Icon name={alt ? 'briefcase' : 'user'} size={20} />
        </span>
        <div>
          <div className="col-tag">{tag}</div>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={s.n}>
            <div className="step">
              <div className="step-num">{s.n}</div>
              <div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="step-conn">
                <Icon name="arrowdown" size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
      <Link className={`btn ${alt ? 'btn-primary' : 'btn-outline'} btn-block`} style={{ marginTop: 22 }} href={href}>
        {cta}
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [stats, shifts] = await Promise.all([
    getPlatformStats(),
    getOpenShifts({ limit: 6 }),
  ]);

  const statItems = [
    { num: stats.openShifts.toLocaleString(), u: '+', lbl: 'Open shifts today' },
    { num: stats.students.toLocaleString(), u: '+', lbl: 'Active student workers' },
    { num: stats.businesses.toLocaleString(), u: '+', lbl: 'Verified Madrid businesses' },
    { num: stats.completedShifts.toLocaleString(), u: '+', lbl: 'Shifts completed' },
  ];

  const heroShift = shifts[0];

  return (
    <>
      <SiteHeader active="How it Works" />
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <span className="pip">NEW</span> Now live across all 21 Madrid districts
              </div>
              <h1 className="hero-h">
                Work when you <em>want to.</em>
              </h1>
              <p className="hero-sub">
                Find 1–4 hour paid shifts that fit perfectly between your classes. Pick one. Work it. Get paid.
              </p>
              <div className="hero-ctas">
                <Link className="btn btn-primary btn-lg" href="/browse">
                  <Icon name="search" size={18} /> Browse Shifts Near Me
                </Link>
                <Link className="btn btn-outline btn-lg" href="/biz/shifts/new">
                  <Icon name="plus" size={18} /> Post a Shift
                </Link>
              </div>
            </div>
            {heroShift && (
              <div className="hero-visual">
                <article className="shift-card">
                  <div className="shift-top">
                    <div className="biz-logo" style={{ background: '#E8401C' }}>
                      {heroShift.business.business_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="biz-name">{heroShift.business.business_name}</div>
                      <div className="biz-role">{heroShift.title}</div>
                    </div>
                  </div>
                </article>
                <div className="float-card" style={{ top: -26, right: -10 }}>
                  <span className="avatar sm" style={{ background: '#2B7A55' }}>
                    SG
                  </span>
                  <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>
                    Sofía got paid
                    <br />
                    <span style={{ color: 'var(--green)', fontWeight: 800 }}>€48.00 ✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="stats-row">
            {statItems.map((s) => (
              <div className="stat" key={s.lbl}>
                <div className="num">
                  {s.num}
                  <span className="u">{s.u}</span>
                </div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="how">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">How it works</div>
            <h2 className="section-title">Two sides. One simple flow.</h2>
            <p className="section-sub">
              Whether you&apos;re picking up shifts or filling them, it takes three steps.
            </p>
          </div>
          <div className="howit">
            <StepCol tag="For Students" title="Earn between classes" steps={STUDENT_STEPS} cta="Start earning" href="/sign-up" />
            <StepCol tag="For Business" title="Staff up in minutes" steps={BIZ_STEPS} alt cta="Post your first shift" href="/sign-up" />
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Open right now</div>
            <h2 className="section-title">Shifts near you, today.</h2>
            <p className="section-sub">Real openings across Madrid. New ones drop every few minutes.</p>
          </div>
          <LandingShifts shifts={shifts as never} />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

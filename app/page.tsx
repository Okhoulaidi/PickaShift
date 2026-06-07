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
  const heroBiz = heroShift?.business.business_name ?? 'Café Lola';
  const heroTitle = heroShift?.title ?? 'Weekend barista';
  const heroDistrict = heroShift?.district ?? 'Chamberí';
  const heroPay =
    heroShift && heroShift.pay_per_hour_cents
      ? (heroShift.pay_per_hour_cents / 100).toFixed(2)
      : '13.50';

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
              <div className="hero-trust">
                <div className="hero-trust-avatars" aria-hidden>
                  <span className="avatar sm" style={{ background: '#2B7A55' }}>SG</span>
                  <span className="avatar sm" style={{ background: '#E8401C' }}>MR</span>
                  <span className="avatar sm" style={{ background: '#1A1A1A' }}>JL</span>
                </div>
                <p>
                  <strong>4.9/5</strong> from students who picked up a shift this month
                </p>
              </div>
            </div>
            <div className="hero-visual" aria-hidden>
              <article className="hero-card">
                <div className="shift-top">
                  <div className="biz-logo" style={{ background: '#E8401C' }}>
                    {heroBiz.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="biz-name">{heroBiz}</div>
                    <div className="biz-role">{heroTitle}</div>
                  </div>
                  <span className="hero-pay-badge">€{heroPay}/hr</span>
                </div>
                <div className="hero-card-meta">
                  <span>
                    <Icon name="pin" size={15} /> {heroDistrict}
                  </span>
                  <span>
                    <Icon name="clock" size={15} /> 4h shift
                  </span>
                  <span>
                    <Icon name="calendar" size={15} /> Today
                  </span>
                </div>
                <div className="hero-card-cta">Apply in one tap</div>
              </article>
              <div className="float-card" style={{ top: -24, right: -12 }}>
                <span className="avatar sm" style={{ background: '#2B7A55' }}>
                  SG
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>
                  Sofía got paid
                  <br />
                  <span style={{ color: 'var(--green)', fontWeight: 800 }}>€48.00 paid</span>
                </div>
              </div>
              <div className="float-card" style={{ bottom: -22, left: -14 }}>
                <span className="hero-float-ico">
                  <Icon name="bolt" size={16} />
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>
                  Paid within
                  <br />
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>24 hours</span>
                </div>
              </div>
            </div>
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

      <section className="block trust-block">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Why students trust us</div>
            <h2 className="section-title">Safe, fair and fast — every shift.</h2>
            <p className="section-sub">
              We handle contracts, payments and verification so you can just show up and earn.
            </p>
          </div>
          <div className="trust-grid">
            {[
              { icon: 'euro', t: 'Paid within 24h', d: 'Money lands in your account the day after your shift — no chasing invoices.' },
              { icon: 'check', t: 'Verified businesses', d: 'Every employer is ID-checked and rated before they can post a shift.' },
              { icon: 'file', t: 'Contracts sorted', d: 'Legal paperwork and social security are handled automatically for you.' },
              { icon: 'star', t: 'Build your score', d: 'Great work earns a reliability score that gets you picked first.' },
            ].map((f) => (
              <div className="trust-card" key={f.t}>
                <span className="trust-ico">
                  <Icon name={f.icon as never} size={20} />
                </span>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
          <div className="testi-grid">
            {[
              { q: 'I picked up three shifts in my first week and got paid the next morning. Genuinely the easiest money I’ve made as a student.', n: 'Sofía G.', r: 'UCM · Barista shifts', av: 'SG', c: '#2B7A55' },
              { q: 'No CV, no awkward interviews. I just filter by the hours between my lectures and apply with one tap.', n: 'Marco R.', r: 'UC3M · Event staff', av: 'MR', c: '#E8401C' },
              { q: 'As a café owner I filled a same-day gap in 20 minutes. The reliability scores make picking people effortless.', n: 'Julia L.', r: 'Café Lola · Chamberí', av: 'JL', c: '#1A1A1A' },
            ].map((t) => (
              <figure className="testi-card" key={t.n}>
                <div className="testi-stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={15} fill />
                  ))}
                </div>
                <blockquote>{t.q}</blockquote>
                <figcaption>
                  <span className="avatar sm" style={{ background: t.c }}>
                    {t.av}
                  </span>
                  <span>
                    <strong>{t.n}</strong>
                    <span className="testi-role">{t.r}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

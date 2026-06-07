import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { Logo } from '@/components/ui/Logo';

const TRUST = [
  { icon: ShieldCheck, label: 'Verified Businesses Only' },
  { icon: Wallet, label: 'Payments within 24h' },
  { icon: Star, label: '4.9 / 5 Student Rating' },
  { icon: CheckCircle2, label: 'Insured Shifts' },
];

export default function HomePage() {
  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <section className="relative flex flex-col lg:flex-row min-h-[85vh] overflow-hidden border-b border-line">
        <div className="relative w-full lg:w-1/2 bg-card flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20">
          <div className="max-w-md animate-reveal">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-4 block">
              For student
            </span>
            <h1 className="font-sora text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.9] tracking-tighter mb-8 text-balance">
              OWN YOUR <br />
              <span className="text-brand">SCHEDULE.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 text-pretty">
              Pick up hospitality and retail shifts across Madrid. Apply in one tap, get paid
              within 24 hours of completing your shift.
            </p>
            <Link
              href="/sign-up?role=student"
              className="group inline-flex items-center gap-3 bg-brand !text-white px-7 py-4 rounded-xl font-sora font-bold text-sm uppercase tracking-widest hover:bg-brand-dark transition-colors"
            >
              Find a Shift
              <ArrowRight className="size-4 !text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 bg-brand flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20 text-white">
          <div className="max-w-md animate-reveal [animation-delay:200ms]">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-light opacity-80 mb-4 block">
              For Business
            </span>
            <h2 className="font-sora text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.9] tracking-tighter mb-8 text-balance">
              SCALE ON <br />
              DEMAND.
            </h2>
            <p className="text-lg text-brand-light/90 mb-10 text-pretty">
              Instantly connect with Madrid&apos;s best student talent. Fill last-minute gaps in
              minutes, not days.
            </p>
            <Link
              href="/sign-up?role=business"
              className="group inline-flex items-center gap-3 bg-white !text-ink px-7 py-4 rounded-xl font-sora font-bold text-sm uppercase tracking-widest hover:bg-canvas transition-colors"
            >
              Post a Shift
              <ArrowRight className="size-4 !text-ink group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-card border-b border-line py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-6">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-success" strokeWidth={2.5} />
              <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand mb-6 block">
            The Pick a Shift promise
          </span>
          <h2 className="font-sora text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.95] text-balance">
            Work when <br className="sm:hidden" />
            <span className="text-brand">you want to.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto">
            No contracts. No commutes you didn&apos;t choose. Just open shifts that fit your week.
          </p>
        </div>
      </section>

      <section id="how" className="py-24 px-6 bg-card border-y border-line">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-sora text-4xl md:text-5xl font-extrabold tracking-tighter mb-16 text-center">
            HOW IT WORKS.
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-6 block">
                For Students
              </span>
              <ol className="space-y-6">
                {[
                  ['Create your profile', 'Tell us your availability, skills, and preferred districts. Takes under 2 minutes.'],
                  ['Browse & apply in one tap', 'See open shifts near you. No CVs, no cover letters.'],
                  ['Work, then get paid', 'Complete your shift. Payment lands in your account within 24h.'],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-5">
                    <div className="size-10 rounded-full bg-brand-light text-brand font-sora font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-6 block">
                For Businesses
              </span>
              <ol className="space-y-6">
                {[
                  ['Post your shift', 'Set role, date, hourly rate. Live in seconds.'],
                  ['Review verified candidates', 'See ratings, experience and reliability scores.'],
                  ['Staff up in minutes', 'Approve with one tap. We handle insurance & payroll.'],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-5">
                    <div className="size-10 rounded-full bg-ink text-white font-sora font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="font-sora text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
              TRANSPARENT ECONOMICS.
            </h3>
            <p className="text-muted-foreground mb-8">
              We only make money when shifts get filled. No subscriptions, no setup fees.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <span className="text-brand font-extrabold">S</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm uppercase mb-1">Free for Students</p>
                  <p className="text-muted-foreground text-sm">What you earn is what you keep.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <span className="text-brand font-extrabold">B</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm uppercase mb-1">Flat rate for Business</p>
                  <p className="text-muted-foreground text-sm">One clear platform fee per shift filled.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-2xl ring-1 ring-black/5 border border-line">
            <div className="flex justify-between items-start mb-8">
              <span className="bg-brand text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded">
                Partner Plan
              </span>
              <p className="text-3xl font-sora font-extrabold tracking-tighter">
                15%
                <span className="text-sm text-muted-foreground font-manrope font-normal"> / per shift</span>
              </p>
            </div>
            <Link
              href="/sign-up?role=business"
              className="block w-full text-center bg-ink !text-white py-4 rounded-xl font-sora font-bold text-xs uppercase tracking-widest hover:bg-brand transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card border-y border-line">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-canvas p-8 border border-line flex flex-col justify-between min-h-64 rounded-2xl">
            <p className="italic text-lg leading-relaxed">
              &ldquo;I found a shift at a cafe in Malasaña within an hour. Payment was in my account
              by the next morning.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="size-10 bg-brand-light rounded-full flex items-center justify-center text-brand font-extrabold">
                L
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase">Lucía G.</p>
                <p className="text-[10px] text-muted-foreground">UCM Student</p>
              </div>
            </div>
          </div>
          <div className="bg-canvas p-8 border border-line flex flex-col justify-between min-h-64 rounded-2xl">
            <p className="italic text-lg leading-relaxed">
              &ldquo;Scaling our weekend staff used to be a nightmare. Now we post and talent shows up
              — vetted and ready.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="size-10 bg-brand-light rounded-full flex items-center justify-center text-brand font-extrabold">
                C
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase">Carlos M.</p>
                <p className="text-[10px] text-muted-foreground">Manager · Restaurante Sol</p>
              </div>
            </div>
          </div>
          <div className="bg-brand p-8 text-white flex flex-col justify-center items-center text-center rounded-2xl min-h-64">
            <p className="font-sora text-3xl font-extrabold tracking-tighter mb-6">Ready to join?</p>
            <Link
              href="/sign-up?role=student"
              className="bg-white !text-ink px-6 py-3 rounded-lg font-extrabold text-xs uppercase tracking-widest hover:bg-canvas transition-colors"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-ink text-white py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-6">
            <Clock className="size-3" /> Live in Madrid
          </div>
          <h2 className="font-sora text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-12 animate-reveal">
            MADRID IS <br />
            <span className="text-brand">WORKING.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up?role=student"
              className="bg-brand hover:bg-brand-dark !text-white px-8 py-5 rounded-2xl font-sora font-bold text-sm uppercase tracking-widest transition-colors"
            >
              I&apos;m a Student
            </Link>
            <Link
              href="/sign-up?role=business"
              className="bg-white/10 hover:bg-white/20 border border-white/20 !text-white px-8 py-5 rounded-2xl font-sora font-bold text-sm uppercase tracking-widest transition-colors"
            >
              I&apos;m a Business
            </Link>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <span className="flex items-center gap-2">
            <Logo className="logo logo-sm !text-white scale-75 origin-left" /> © 2026 Pick a Shift S.L.
          </span>
          <div className="flex gap-6">
            <Link href="/sign-in" className="hover:text-white transition-colors">Log in</Link>
            <Link href="/browse" className="hover:text-white transition-colors">Browse shifts</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

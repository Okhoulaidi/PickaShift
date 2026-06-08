import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LandingNav } from '@/components/landing/LandingNav';
import { Logo } from '@/components/ui/Logo';

export default async function HomePage() {
  const t = await getTranslations('landing');

  const TRUST = [
    { icon: ShieldCheck, label: t('trustReviewed') },
    { icon: Wallet, label: t('trustEarnings') },
    { icon: Star, label: t('trustRatings') },
    { icon: CheckCircle2, label: t('trustFlexible') },
  ];

  const studentSteps = [
    [t('studentSteps.step1Title'), t('studentSteps.step1Body')],
    [t('studentSteps.step2Title'), t('studentSteps.step2Body')],
    [t('studentSteps.step3Title'), t('studentSteps.step3Body')],
  ];

  const businessSteps = [
    [t('businessSteps.step1Title'), t('businessSteps.step1Body')],
    [t('businessSteps.step2Title'), t('businessSteps.step2Body')],
    [t('businessSteps.step3Title'), t('businessSteps.step3Body')],
  ];

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <section className="relative flex flex-col lg:flex-row min-h-[85vh] overflow-hidden border-b border-line">
        <div className="relative w-full lg:w-1/2 bg-card flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20">
          <div className="max-w-md animate-reveal">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-4 block">
              {t('studentEyebrow')}
            </span>
            <h1 className="font-sora text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.9] tracking-tighter mb-8 text-balance">
              {t('studentHeadline1')} <br />
              <span className="text-brand">{t('studentHeadline2')}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 text-pretty">
              {t('studentBody')}
            </p>
            <Link
              href="/sign-up?role=student"
              className="group inline-flex items-center gap-3 bg-brand !text-white px-7 py-4 rounded-xl font-sora font-bold text-sm uppercase tracking-widest hover:bg-brand-dark transition-colors"
            >
              {t('findShift')}
              <ArrowRight className="size-4 !text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 bg-brand flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20 text-white">
          <div className="max-w-md animate-reveal [animation-delay:200ms]">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70 mb-4 block">
              {t('businessEyebrow')}
            </span>
            <h2 className="font-sora text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.9] tracking-tighter mb-8 text-balance">
              {t('businessHeadline1')} <br />
              {t('businessHeadline2')}
            </h2>
            <p className="text-lg text-white/85 mb-10 text-pretty">
              {t('businessBody')}
            </p>
            <Link
              href="/sign-up?role=business"
              className="group inline-flex items-center gap-3 bg-navy !text-white px-7 py-4 rounded-xl font-sora font-bold text-sm uppercase tracking-widest hover:bg-navy-mid transition-colors"
            >
              {t('postShift')}
              <ArrowRight className="size-4 !text-white group-hover:translate-x-1 transition-transform" />
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
            {t('promiseEyebrow')}
          </span>
          <h2 className="font-sora text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.95] text-balance">
            {t('promiseHeadline1')} <br className="sm:hidden" />
            <span className="text-brand">{t('promiseHeadline2')}</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto">
            {t('promiseBody')}
          </p>
        </div>
      </section>

      <section id="how" className="py-24 px-6 bg-card border-y border-line">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-sora text-4xl md:text-5xl font-extrabold tracking-tighter mb-16 text-center">
            {t('howTitle')}
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-6 block">
                {t('howStudentsEyebrow')}
              </span>
              <ol className="space-y-6">
                {studentSteps.map(([title, body], i) => (
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
                {t('howBusinessEyebrow')}
              </span>
              <ol className="space-y-6">
                {businessSteps.map(([title, body], i) => (
                  <li key={title} className="flex gap-5">
                    <div className="size-10 rounded-full bg-navy-mid text-white font-sora font-extrabold flex items-center justify-center shrink-0">
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
              {t('pricingTitle')}
            </h3>
            <p className="text-muted-foreground mb-8">
              {t('pricingBody')}
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <span className="text-brand font-extrabold">S</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm uppercase mb-1">{t('pricingStudentTitle')}</p>
                  <p className="text-muted-foreground text-sm">{t('pricingStudentBody')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <span className="text-brand font-extrabold">B</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm uppercase mb-1">{t('pricingBusinessTitle')}</p>
                  <p className="text-muted-foreground text-sm">{t('pricingBusinessBody')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-2xl ring-1 ring-black/5 border border-line">
            <div className="flex justify-between items-start mb-8">
              <span className="bg-brand text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded">
                {t('partnerPlan')}
              </span>
              <p className="text-3xl font-sora font-extrabold tracking-tighter">
                15%
                <span className="text-sm text-muted-foreground font-manrope font-normal">{t('perShift')}</span>
              </p>
            </div>
            <Link
              href="/sign-up?role=business"
              className="block w-full text-center bg-brand !text-white py-4 rounded-xl font-sora font-bold text-xs uppercase tracking-widest hover:bg-brand-dark transition-colors"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card border-y border-line">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-canvas p-8 border border-line flex flex-col justify-between min-h-64 rounded-2xl">
            <p className="italic text-lg leading-relaxed">
              &ldquo;{t('testimonial1')}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="size-10 bg-brand-light rounded-full flex items-center justify-center text-brand font-extrabold">
                L
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase">{t('testimonial1Name')}</p>
                <p className="text-[10px] text-muted-foreground">{t('testimonial1Role')}</p>
              </div>
            </div>
          </div>
          <div className="bg-canvas p-8 border border-line flex flex-col justify-between min-h-64 rounded-2xl">
            <p className="italic text-lg leading-relaxed">
              &ldquo;{t('testimonial2')}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="size-10 bg-brand-light rounded-full flex items-center justify-center text-brand font-extrabold">
                C
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase">{t('testimonial2Name')}</p>
                <p className="text-[10px] text-muted-foreground">{t('testimonial2Role')}</p>
              </div>
            </div>
          </div>
          <div className="bg-brand p-8 text-white flex flex-col justify-center items-center text-center rounded-2xl min-h-64">
            <p className="font-sora text-3xl font-extrabold tracking-tighter mb-6">{t('readyToJoin')}</p>
            <Link
              href="/sign-up?role=student"
              className="bg-white !text-ink px-6 py-3 rounded-lg font-extrabold text-xs uppercase tracking-widest hover:bg-canvas transition-colors"
            >
              {t('createProfile')}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-navy text-white py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-6">
            <Clock className="size-3" /> {t('footerLive')}
          </div>
          <h2 className="font-sora text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-12 animate-reveal">
            {t('footerHeadline1')} <br />
            <span className="text-brand">{t('footerHeadline2')}</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up?role=student"
              className="bg-brand hover:bg-brand-dark !text-white px-8 py-5 rounded-2xl font-sora font-bold text-sm uppercase tracking-widest transition-colors"
            >
              {t('imStudent')}
            </Link>
            <Link
              href="/sign-up?role=business"
              className="bg-navy hover:bg-navy-mid border border-white/20 !text-white px-8 py-5 rounded-2xl font-sora font-bold text-sm uppercase tracking-widest transition-colors"
            >
              {t('imBusiness')}
            </Link>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <span className="flex items-center gap-2">
            <Logo className="logo logo-sm !text-white scale-75 origin-left" /> {t('copyright')}
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/sign-in" className="hover:text-white transition-colors">{t('footerLogIn')}</Link>
            <Link href="/browse" className="hover:text-white transition-colors">{t('footerBrowse')}</Link>
            <Link href="/help" className="hover:text-white transition-colors">{t('footerHelp')}</Link>
            <Link href="/faq" className="hover:text-white transition-colors">{t('footerFaq')}</Link>
            <Link href="/contact" className="hover:text-white transition-colors">{t('footerContact')}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{t('footerPrivacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('footerTerms')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, BookOpen, Users, Building2, CreditCard, ShieldCheck, Flag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE } from '@/lib/site';

const CATEGORY_CONFIG = [
  { id: 'gettingStarted', icon: BookOpen, articleKeys: ['whatIs', 'whoCan', 'free', 'createAccount'] },
  { id: 'forStudents', icon: Users, articleKeys: ['findApply', 'afterApply', 'cancel', 'reliability', 'cv', 'earnings'] },
  { id: 'forBusinesses', icon: Building2, articleKeys: ['postShift', 'reviewApplicants', 'message', 'talentPool', 'complete'] },
  { id: 'payments', icon: CreditCard, articleKeys: ['howPayment', 'notPaid', 'fees'] },
  { id: 'accountSecurity', icon: ShieldCheck, articleKeys: ['updateProfile', 'forgotPassword', 'deleteAccount', 'suspended'] },
  { id: 'reporting', icon: Flag, articleKeys: ['reportUser', 'bug', 'disputeReview'] },
] as const;

function Accordion({ articles }: { articles: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line">
      {articles.map((a, i) => (
        <div key={a.q}>
          <button
            className="w-full text-left py-4 flex items-center justify-between gap-4 group"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-semibold text-ink group-hover:text-brand transition-colors text-sm sm:text-base">
              {a.q}
            </span>
            <ChevronDown
              className={`shrink-0 size-4 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <p className="pb-5 text-muted-foreground leading-relaxed text-sm">{a.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HelpPage() {
  const t = useTranslations('help');

  const categories = CATEGORY_CONFIG.map((cat) => ({
    ...cat,
    title: t(`categories.${cat.id}.title`),
    articles: cat.articleKeys.map((key) => ({
      q: t(`categories.${cat.id}.articles.${key}.q`),
      a: t(`categories.${cat.id}.articles.${key}.a`, { email: SITE.emails.hello }),
    })),
  }));

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            {t('eyebrow')}
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.rich('intro', {
              contact: (chunks) => (
                <Link href="/contact" className="text-brand hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-14">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="bg-card border border-line rounded-xl p-4 flex flex-col gap-2 hover:border-brand/40 hover:shadow-sm transition-all group"
            >
              <c.icon className="size-5 text-brand" />
              <span className="font-semibold text-sm group-hover:text-brand transition-colors">
                {c.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('articles', { count: c.articles.length })}
              </span>
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {categories.map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
                <div className="size-9 rounded-xl bg-brand/10 flex items-center justify-center">
                  <c.icon className="size-5 text-brand" />
                </div>
                <h2 className="font-sora text-xl font-bold">{c.title}</h2>
              </div>
              <div className="bg-card border border-line rounded-2xl px-6">
                <Accordion articles={c.articles} />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-brand text-white rounded-2xl p-8 text-center">
          <h3 className="font-sora font-bold text-xl mb-2">{t('stillNeedHelp')}</h3>
          <p className="text-brand-light/90 mb-6">{t('teamResponse')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white !text-brand px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-light transition-colors"
          >
            {t('contactSupport')}
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

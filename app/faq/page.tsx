'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

const FAQ_ITEMS = [
  { key: 'whatIs', tag: 'general' },
  { key: 'freeSignup', tag: 'general' },
  { key: 'shiftTypes', tag: 'general' },
  { key: 'cities', tag: 'general' },
  { key: 'experience', tag: 'students' },
  { key: 'hearBack', tag: 'students' },
  { key: 'multipleShifts', tag: 'students' },
  { key: 'cantMake', tag: 'students' },
  { key: 'reliability', tag: 'students' },
  { key: 'fillShift', tag: 'businesses' },
  { key: 'rehire', tag: 'businesses' },
  { key: 'noShow', tag: 'businesses' },
  { key: 'rightToWork', tag: 'businesses' },
  { key: 'paymentWork', tag: 'payments' },
  { key: 'whenPaid', tag: 'payments' },
  { key: 'paymentDispute', tag: 'payments' },
  { key: 'vetting', tag: 'safety' },
  { key: 'unsafe', tag: 'safety' },
  { key: 'inappropriate', tag: 'safety' },
] as const;

const TAG_KEYS = ['all', 'general', 'students', 'businesses', 'payments', 'safety'] as const;

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-0">
      <button
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-ink group-hover:text-brand transition-colors">{q}</span>
        <ChevronDown
          className={`shrink-0 size-4 text-muted-foreground mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations('faq');
  const [activeTag, setActiveTag] = useState('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = FAQ_ITEMS.map((item) => ({
    tag: item.tag,
    q: t(`items.${item.key}.q`),
    a: t(`items.${item.key}.a`),
  }));

  const filtered = activeTag === 'all' ? faqs : faqs.filter((f) => f.tag === activeTag);

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            {t('eyebrow')}
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t.rich('intro', {
              help: (chunks) => (
                <Link href="/help" className="text-brand hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {TAG_KEYS.map((tag) => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setOpenIdx(null); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTag === tag
                  ? 'bg-brand text-white'
                  : 'bg-card border border-line text-muted-foreground hover:border-brand/40 hover:text-brand'
              }`}
            >
              {t(`tags.${tag}`)}
            </button>
          ))}
        </div>

        <div className="bg-card border border-line rounded-2xl px-6">
          {filtered.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">{t('stillHaveQuestion')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/help"
              className="bg-card border border-line rounded-xl px-6 py-3 font-semibold text-sm hover:border-brand/40 transition-colors"
            >
              {t('browseHelp')}
            </Link>
            <Link
              href="/contact"
              className="bg-brand !text-white rounded-xl px-6 py-3 font-semibold text-sm hover:bg-brand-dark transition-colors"
            >
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

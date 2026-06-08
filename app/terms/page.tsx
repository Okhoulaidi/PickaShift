import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata = {
  title: 'Terms of Service — Pick a Shift',
  description: 'The rules and conditions that govern use of the Pick a Shift platform.',
};

const TERMS_SECTION_KEYS = [
  'acceptance',
  'description',
  'eligibility',
  'accounts',
  'studentObligations',
  'businessObligations',
  'prohibited',
  'payments',
  'reviews',
  'ip',
  'liability',
  'termination',
  'governingLaw',
  'contact',
] as const;

export default async function TermsPage() {
  const t = await getTranslations('legal.terms');

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            {t('eyebrow')}
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('lastUpdated')} <strong>{t('lastUpdatedDate')}</strong>
          </p>
          <p className="mt-3 text-muted-foreground">{t('intro')}</p>
        </div>

        <nav className="bg-card border border-line rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {t('contents')}
          </h2>
          <ol className="space-y-2 columns-2">
            {TERMS_SECTION_KEYS.map((key) => (
              <li key={key}>
                <a href={`#${key}`} className="text-sm text-brand hover:underline">
                  {t(`sections.${key}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {TERMS_SECTION_KEYS.map((key) => {
            const paragraphs = t.raw(`sections.${key}.paragraphs`) as string[] | undefined;
            const listItems = t.raw(`sections.${key}.listItems`) as string[] | undefined;
            const footer = t.has(`sections.${key}.footer`)
              ? t(`sections.${key}.footer`)
              : null;

            return (
              <section key={key} id={key} className="scroll-mt-24">
                <h2 className="font-sora text-xl font-bold mb-4 pb-3 border-b border-line">
                  {t(`sections.${key}.title`)}
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  {paragraphs?.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                  {listItems && (
                    <ul className="space-y-2">
                      {listItems.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-2">
                          <span className="text-brand mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {footer && <p>{footer}</p>}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/privacy"
            className="flex-1 text-center bg-card border border-line rounded-xl px-6 py-4 font-semibold text-sm hover:border-brand/40 transition-colors"
          >
            {t('privacyLink')}
          </Link>
          <Link
            href="/contact"
            className="flex-1 text-center bg-brand !text-white rounded-xl px-6 py-4 font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            {t('contactLink')}
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

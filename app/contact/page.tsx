'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { submitContactForm } from '@/lib/actions/contact';
import { SITE } from '@/lib/site';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

export default function ContactPage() {
  const t = useTranslations('contact');
  const subjectKeys = ['general', 'technical', 'business', 'payment', 'report', 'deletion', 'press', 'other'] as const;
  const SUBJECTS = subjectKeys.map((key) => ({ key, label: t(`subjects.${key}`) }));

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: SUBJECTS[0]!.label,
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitContactForm(form);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  const quickLinks = [
    { label: t('faqLink'), href: '/faq' },
    { label: t('helpLink'), href: '/help' },
    { label: t('privacyLink'), href: '/privacy' },
    { label: t('termsLink'), href: '/terms' },
  ];

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            {t('eyebrow')}
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.rich('intro', {
              faq: (chunks) => (
                <Link href="/faq" className="text-brand hover:underline">
                  {chunks}
                </Link>
              ),
              help: (chunks) => (
                <Link href="/help" className="text-brand hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <aside className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('email')}</h3>
                  <a
                    href={`mailto:${SITE.emails.hello}`}
                    className="text-sm text-brand hover:underline mt-0.5 block"
                  >
                    {SITE.emails.hello}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('responseTime')}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">
                    {t('responseDetail')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('basedIn')}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{t('location')}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-line rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">{t('quickLinks')}</h3>
              <ul className="space-y-2">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-brand transition-colors flex items-center gap-1"
                    >
                      <span className="text-brand">→</span> {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-card border border-line rounded-2xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
                    <CheckCircle2 className="size-8 text-success" />
                  </div>
                  <h2 className="font-sora font-bold text-xl mb-2">{t('successTitle')}</h2>
                  <p className="text-muted-foreground max-w-sm">
                    {t('successBody', { email: form.email })}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', subject: SUBJECTS[0]!.label, message: '', website: '' });
                    }}
                    className="mt-6 text-sm text-brand hover:underline"
                  >
                    {t('sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-1.5">
                        {t('fullName')} <span className="text-brand">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t('namePlaceholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                        {t('emailAddress')} <span className="text-brand">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold mb-1.5">
                      {t('subject')} <span className="text-brand">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.key} value={s.label}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-1.5">
                      {t('message')} <span className="text-brand">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('messagePlaceholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t.rich('privacyNote', {
                      privacy: (chunks) => (
                        <Link href="/privacy" className="text-brand hover:underline">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </p>

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand !text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
                  >
                    {loading ? t('sending') : t('sendMessage')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

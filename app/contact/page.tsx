'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { submitContactForm } from '@/lib/actions/contact';
import { SITE } from '@/lib/site';

const SUBJECTS = [
  'General Enquiry',
  'Technical Issue',
  'Business Enquiry',
  'Payment Dispute',
  'Report a User',
  'Account Deletion Request',
  'Press & Media',
  'Other',
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: SUBJECTS[0]!,
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

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            Get in Touch
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We read every message and respond within 24–48 hours on business days. For quick
            answers, check the{' '}
            <Link href="/faq" className="text-brand hover:underline">
              FAQ
            </Link>{' '}
            or{' '}
            <Link href="/help" className="text-brand hover:underline">
              Help Center
            </Link>{' '}
            first.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Email</h3>
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
                  <h3 className="font-semibold text-sm">Response Time</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Within 24–48 hours
                    <br />
                    Monday–Friday, 9am–6pm CET
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Based in</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Madrid, España</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-line rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Frequently Asked Questions', href: '/faq' },
                  { label: 'Help Center', href: '/help' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map(({ label, href }) => (
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

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-line rounded-2xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
                    <CheckCircle2 className="size-8 text-success" />
                  </div>
                  <h2 className="font-sora font-bold text-xl mb-2">Message sent!</h2>
                  <p className="text-muted-foreground max-w-sm">
                    Thanks for reaching out. We'll get back to you at{' '}
                    <strong>{form.email}</strong> within 24–48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', subject: SUBJECTS[0]!, message: '', website: '' });
                    }}
                    className="mt-6 text-sm text-brand hover:underline"
                  >
                    Send another message
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
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-1.5"
                      >
                        Full Name <span className="text-brand">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-1.5"
                      >
                        Email Address <span className="text-brand">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold mb-1.5"
                    >
                      Subject <span className="text-brand">*</span>
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
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold mb-1.5"
                    >
                      Message <span className="text-brand">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your question or issue in as much detail as possible..."
                      className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy" className="text-brand hover:underline">
                      Privacy Policy
                    </Link>
                    .
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
                    {loading ? 'Sending…' : 'Send Message'}
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

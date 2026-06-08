import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy — Pick a Shift',
  description: 'How Pick a Shift collects, uses, and protects your personal data under GDPR.',
};

const SECTIONS = [
  {
    id: 'who-we-are',
    title: '1. Who We Are',
    content: (
      <>
        <p>
          Pick a Shift ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") is a
          marketplace platform connecting students with businesses offering short-term shifts in
          Madrid, Spain. Our registered company name is{' '}
          <strong>{SITE.legalName}</strong>, operating under Spanish law.
        </p>
        <p className="mt-3">
          For the purposes of the General Data Protection Regulation (EU) 2016/679 ("GDPR"), we
          act as the <strong>data controller</strong> for personal data processed through this
          platform.
        </p>
        <p className="mt-3">
          Contact us about privacy matters at:{' '}
          <a href={`mailto:${SITE.emails.privacy}`} className="text-brand hover:underline">
            {SITE.emails.privacy}
          </a>
        </p>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: '2. Data We Collect',
    content: (
      <>
        <p>We collect the following categories of personal data:</p>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-semibold text-ink">Account & Identity Data</h4>
            <p className="mt-1 text-muted-foreground">
              Name, email address, profile photo, and account credentials. Collected when you
              register.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink">Profile Data (Students)</h4>
            <p className="mt-1 text-muted-foreground">
              University, degree, year of study, skills, languages, availability preferences,
              Madrid district, bio, and optionally a CV document.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink">Profile Data (Businesses)</h4>
            <p className="mt-1 text-muted-foreground">
              Business name, type, NIF/CIF, registered district, address, phone number, public
              email, website, and description.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink">Activity Data</h4>
            <p className="mt-1 text-muted-foreground">
              Shift applications, accepted and completed shifts, messages exchanged on the
              platform, reviews and ratings left or received, and notifications.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink">Usage & Technical Data</h4>
            <p className="mt-1 text-muted-foreground">
              IP address, browser type, device information, and pages visited. Collected
              automatically when you use the platform.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'legal-basis',
    title: '3. Legal Basis for Processing',
    content: (
      <>
        <p>We process your data under the following legal bases (GDPR Article 6):</p>
        <ul className="mt-4 space-y-3 list-none">
          {[
            {
              basis: 'Contract performance (Art. 6(1)(b))',
              desc: 'Processing necessary to provide the marketplace service — creating your account, matching you with shifts, processing applications, and facilitating messaging.',
            },
            {
              basis: 'Legitimate interests (Art. 6(1)(f))',
              desc: 'Platform security, fraud prevention, improving our service, and sending operational communications about your account activity.',
            },
            {
              basis: 'Consent (Art. 6(1)(a))',
              desc: 'Marketing communications and non-essential cookies. You may withdraw consent at any time.',
            },
            {
              basis: 'Legal obligation (Art. 6(1)(c))',
              desc: 'Retaining records as required under Spanish commercial and tax law.',
            },
          ].map(({ basis, desc }) => (
            <li key={basis} className="pl-4 border-l-2 border-brand/30">
              <span className="font-semibold text-ink">{basis}:</span>{' '}
              <span className="text-muted-foreground">{desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '4. How We Use Your Data',
    content: (
      <>
        <p>We use your personal data to:</p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Create and manage your account',
            'Match students with relevant open shifts',
            'Enable businesses to review applicant profiles',
            'Facilitate messaging between students and businesses',
            'Calculate and display earnings and shift history',
            'Send notifications about your applications, shifts, and account',
            'Display public reviews and reliability scores',
            'Detect and prevent fraud or misuse of the platform',
            'Comply with legal and regulatory obligations in Spain',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: '5. Third-Party Processors',
    content: (
      <>
        <p>
          We share data with trusted third-party processors who act under our instructions and
          are bound by data processing agreements:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 pr-4 font-semibold text-ink">Processor</th>
                <th className="text-left py-2 pr-4 font-semibold text-ink">Purpose</th>
                <th className="text-left py-2 font-semibold text-ink">Location</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ['Clerk', 'User authentication and session management', 'USA (SCCs)'],
                ['Supabase', 'Database storage and file storage', 'EU'],
                ['Vercel', 'Platform hosting and edge delivery', 'USA (SCCs)'],
              ].map(([name, purpose, location]) => (
                <tr key={name} className="border-b border-line/50">
                  <td className="py-2 pr-4 font-medium text-ink">{name}</td>
                  <td className="py-2 pr-4">{purpose}</td>
                  <td className="py-2">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Where data is transferred outside the EU, we ensure adequate safeguards via Standard
          Contractual Clauses (SCCs) approved by the European Commission.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    content: (
      <>
        <p>We retain your data for the following periods:</p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Active account data: for as long as your account is open.',
            'Shift and application history: 3 years after the shift date, for dispute resolution purposes.',
            'Messages: 2 years from the date of the conversation.',
            'After account deletion: anonymised aggregate data may be retained for analytics; identifiable data is deleted within 30 days.',
            'Financial records: 7 years as required by Spanish tax law (Ley General Tributaria).',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: '7. Your Rights Under GDPR',
    content: (
      <>
        <p>
          As a data subject in the EU/EEA, you have the following rights under the GDPR:
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {[
            { right: 'Right of Access (Art. 15)', desc: 'Request a copy of the personal data we hold about you.' },
            { right: 'Right to Rectification (Art. 16)', desc: 'Correct inaccurate or incomplete data.' },
            { right: 'Right to Erasure (Art. 17)', desc: 'Request deletion of your data, subject to legal retention obligations.' },
            { right: 'Right to Restriction (Art. 18)', desc: 'Limit how we process your data in certain circumstances.' },
            { right: 'Right to Portability (Art. 20)', desc: 'Receive your data in a structured, machine-readable format.' },
            { right: 'Right to Object (Art. 21)', desc: 'Object to processing based on legitimate interests or for direct marketing.' },
          ].map(({ right, desc }) => (
            <div key={right} className="bg-canvas rounded-xl p-4 border border-line">
              <h4 className="font-semibold text-sm text-ink">{right}</h4>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground">
          To exercise any of these rights, email us at{' '}
          <a href={`mailto:${SITE.emails.privacy}`} className="text-brand hover:underline">
            {SITE.emails.privacy}
          </a>
          . We will respond within 30 days. You also have the right to lodge a complaint with the
          Spanish data protection authority,{' '}
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    content: (
      <>
        <p>
          We use only the cookies strictly necessary to operate the platform:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Authentication session cookies (via Clerk) — keep you signed in during your session.',
            'Security cookies — protect against CSRF attacks.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted-foreground">
          We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will update the
        "Last updated" date at the top of this page and, where changes are material, notify you
        by email. Your continued use of the platform after any change constitutes acceptance of
        the updated policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            Legal
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: <strong>June 2026</strong>
          </p>
          <p className="mt-3 text-muted-foreground">
            This policy explains what personal data Pick a Shift collects, why we collect it, and
            what rights you have over it. It applies to all users of the platform — students,
            businesses, and visitors.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="bg-card border border-line rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Contents
          </h2>
          <ol className="space-y-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-brand hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-sora text-xl font-bold mb-4 pb-3 border-b border-line">
                {s.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed">{s.content}</div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-brand/5 border border-brand/20 rounded-2xl p-8 text-center">
          <h3 className="font-sora font-bold text-lg mb-2">Have a privacy question?</h3>
          <p className="text-muted-foreground mb-4">
            We're happy to help. Reach out and we'll respond within 30 days.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand !text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

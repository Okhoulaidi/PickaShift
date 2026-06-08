import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Terms of Service — Pick a Shift',
  description: 'The rules and conditions that govern use of the Pick a Shift platform.',
};

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <p>
        By creating an account or using the Pick a Shift platform ("Platform"), you agree to
        be bound by these Terms of Service ("Terms"). If you do not agree, do not use the
        Platform. We may update these Terms at any time; continued use after changes are
        posted constitutes acceptance. Material changes will be notified by email.
      </p>
    ),
  },
  {
    id: 'description',
    title: '2. What Pick a Shift Does',
    content: (
      <>
        <p>
          Pick a Shift is an online marketplace that connects students in Madrid with
          businesses offering short-term, flexible shift work. We facilitate the connection —
          we are not an employer, staffing agency, or party to any employment contract formed
          through the Platform.
        </p>
        <p className="mt-3">
          Any shift agreement is directly between the student and the business. Pick a Shift
          takes no responsibility for the performance of either party under that agreement.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: '3. Eligibility',
    content: (
      <>
        <p>To use the Platform you must:</p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Be at least 18 years old, or the minimum legal working age in Spain, whichever is higher.',
            'Have the legal right to work in Spain.',
            'Provide accurate, current, and complete information when registering.',
            'Not have been previously suspended or banned from the Platform.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted-foreground">
          Businesses must be legally registered entities operating in Spain and authorised to
          employ or engage workers.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    title: '4. Accounts',
    content: (
      <>
        <p>
          You are responsible for keeping your account credentials secure. You must not share
          your account or allow others to use it. Notify us immediately at{' '}
          <a href={`mailto:${SITE.emails.hello}`} className="text-brand hover:underline">
            {SITE.emails.hello}
          </a>{' '}
          if you suspect unauthorised access.
        </p>
        <p className="mt-3">
          Each person may hold only one account per role (student or business). Creating
          duplicate accounts to circumvent a suspension is prohibited.
        </p>
      </>
    ),
  },
  {
    id: 'student-obligations',
    title: '5. Student Obligations',
    content: (
      <>
        <p>As a student on the Platform, you agree to:</p>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          {[
            'Provide accurate profile information, including your university enrolment, skills, and availability.',
            'Only apply for shifts you genuinely intend to and are able to work.',
            'Arrive on time and fulfil the shift as agreed with the business.',
            'Behave professionally and treat business staff and customers with respect.',
            'Notify the business as early as possible if you are unable to attend an accepted shift.',
            'Not share any confidential information of the business obtained during a shift.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted-foreground">
          Repeated no-shows or cancellations may result in account suspension.
        </p>
      </>
    ),
  },
  {
    id: 'business-obligations',
    title: '6. Business Obligations',
    content: (
      <>
        <p>As a business on the Platform, you agree to:</p>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          {[
            'Post accurate shift descriptions, including role, hours, pay rate, location, and requirements.',
            'Pay the agreed rate for hours worked, promptly after shift completion.',
            'Not discriminate against applicants on the basis of race, gender, religion, disability, or any other protected characteristic under Spanish law.',
            'Ensure a safe working environment that complies with applicable health and safety regulations.',
            'Only contact students through the Platform for shift-related communication.',
            'Not request work outside of the agreed shift hours without additional compensation.',
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
    id: 'prohibited',
    title: '7. Prohibited Conduct',
    content: (
      <>
        <p>You must not use the Platform to:</p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Post false, misleading, or fraudulent information.',
            'Harass, threaten, or intimidate other users.',
            'Circumvent the Platform by arranging payment or future work directly with matched users outside of Pick a Shift.',
            'Upload malicious code, spam, or unsolicited commercial communications.',
            'Scrape, crawl, or extract data from the Platform without our written consent.',
            'Impersonate another person or entity.',
            'Violate any applicable law, including Spanish employment and data protection law.',
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
    id: 'payments',
    title: '8. Payments & Earnings',
    content: (
      <>
        <p>
          Pick a Shift displays pay rates and tracks completed shift earnings as an informational
          record. Payment for work is the direct responsibility of the business and must be made
          to the student in accordance with the agreed rate and applicable Spanish labour law.
        </p>
        <p className="mt-3">
          We currently do not process payments on behalf of either party. Any payment disputes
          are between the student and the business. We recommend both parties keep records of
          completed shifts.
        </p>
      </>
    ),
  },
  {
    id: 'reviews',
    title: '9. Reviews & Ratings',
    content: (
      <p>
        After a shift is completed, both the student and the business may leave a review. Reviews
        must be honest and based on direct experience of the shift. We reserve the right to remove
        reviews that contain false information, personal attacks, or content that violates these
        Terms. Reviews cannot be altered or deleted by the reviewer after submission — contact us
        if you believe a review is inaccurate or abusive.
      </p>
    ),
  },
  {
    id: 'ip',
    title: '10. Intellectual Property',
    content: (
      <p>
        All content, trademarks, logos, and software on the Platform are the property of Pick a
        Shift or its licensors. You may not reproduce, distribute, or create derivative works
        without our express written permission. You grant us a non-exclusive licence to use
        content you upload (such as profile photos and CV documents) solely for the purpose of
        operating the Platform.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '11. Limitation of Liability',
    content: (
      <>
        <p>
          To the maximum extent permitted by Spanish law, Pick a Shift is not liable for:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {[
            'Any loss arising from a student failing to attend or perform a shift.',
            'Any loss arising from a business failing to pay for a completed shift.',
            'Indirect, incidental, or consequential damages of any kind.',
            'Interruptions to the Platform due to maintenance, technical failures, or events outside our control.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted-foreground">
          Nothing in these Terms limits our liability for death or personal injury caused by our
          negligence, or any other liability that cannot be excluded under applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: '12. Termination',
    content: (
      <>
        <p>
          You may delete your account at any time. We reserve the right to suspend or terminate
          your access if you breach these Terms, engage in behaviour that harms other users, or
          if we are required to do so by law.
        </p>
        <p className="mt-3">
          Upon termination, your profile will be deactivated and removed from public view. Data
          will be retained and deleted in accordance with our{' '}
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: '13. Governing Law',
    content: (
      <p>
        These Terms are governed by the laws of Spain. Any dispute arising out of or in
        connection with these Terms shall be subject to the exclusive jurisdiction of the courts
        of Madrid, Spain, without prejudice to your rights as a consumer under applicable EU law.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '14. Contact',
    content: (
      <p>
        For any questions about these Terms, contact us at{' '}
        <a href={`mailto:${SITE.emails.legal}`} className="text-brand hover:underline">
          {SITE.emails.legal}
        </a>{' '}
        or visit our{' '}
        <Link href="/contact" className="text-brand hover:underline">
          contact page
        </Link>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            Legal
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: <strong>June 2026</strong>
          </p>
          <p className="mt-3 text-muted-foreground">
            Please read these Terms carefully before using Pick a Shift. They set out your rights
            and obligations as a student, business, or visitor on the Platform.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="bg-card border border-line rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Contents
          </h2>
          <ol className="space-y-2 columns-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-brand hover:underline">
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

        {/* Bottom nav */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/privacy"
            className="flex-1 text-center bg-card border border-line rounded-xl px-6 py-4 font-semibold text-sm hover:border-brand/40 transition-colors"
          >
            Privacy Policy →
          </Link>
          <Link
            href="/contact"
            className="flex-1 text-center bg-brand !text-white rounded-xl px-6 py-4 font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            Questions? Contact Us →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

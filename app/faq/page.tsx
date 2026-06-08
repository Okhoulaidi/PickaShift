'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

type FAQ = { q: string; a: React.ReactNode; tag: string };

const FAQS: FAQ[] = [
  // General
  {
    tag: 'General',
    q: 'What is Pick a Shift?',
    a: 'Pick a Shift is a marketplace for short-term, flexible shift work in Madrid. Students browse and apply for shifts posted by local businesses — in hospitality, retail, events, and more. No long-term contracts, no CVs required.',
  },
  {
    tag: 'General',
    q: 'Is it free to sign up?',
    a: 'Yes. Creating a student account and browsing shifts is completely free. We never take a percentage of your earnings.',
  },
  {
    tag: 'General',
    q: 'What kinds of shifts are available?',
    a: 'Most shifts are in hospitality (waitstaff, bar, kitchen), retail, events, and promotions across Madrid. Shifts typically last 4–10 hours and are often on evenings and weekends — designed to fit around your university schedule.',
  },
  {
    tag: 'General',
    q: 'What cities does Pick a Shift operate in?',
    a: 'We currently operate exclusively in Madrid. We plan to expand to other Spanish cities in the future.',
  },
  // Students
  {
    tag: 'Students',
    q: 'Do I need work experience to apply?',
    a: 'No. Many shifts are entry-level. Each listing specifies what skills or experience are preferred. Your profile, reliability score, and attitude matter more than a lengthy CV.',
  },
  {
    tag: 'Students',
    q: 'How quickly will I hear back after applying?',
    a: 'It depends on the business. Most respond within 24–48 hours. You\'ll receive a notification as soon as your application is accepted or declined.',
  },
  {
    tag: 'Students',
    q: 'Can I work multiple shifts at once?',
    a: 'Yes, as long as the shifts don\'t overlap. You can have multiple accepted applications at the same time.',
  },
  {
    tag: 'Students',
    q: 'What happens if I can\'t make a shift I accepted?',
    a: 'Contact the business immediately via the platform messaging and let them know as early as possible. Giving notice early is the professional thing to do and protects your standing with businesses on the platform.',
  },
  {
    tag: 'Students',
    q: 'How does my reliability score work?',
    a: 'After each completed shift, the business can leave a rating out of 5. Your reliability score is the average of all ratings you\'ve received. It\'s visible to businesses when they review your application — the higher it is, the more competitive you look.',
  },
  // Businesses
  {
    tag: 'Businesses',
    q: 'How quickly can I fill a shift?',
    a: 'Many shifts get applications within hours of being posted. For urgent shifts, mark them as urgent — they get highlighted in search results. You can accept an applicant immediately once their profile meets your requirements.',
  },
  {
    tag: 'Businesses',
    q: 'Can I re-hire students I\'ve worked with before?',
    a: 'Yes. Add students to your Talent Pool after a completed shift and you can browse them any time to invite them to future shifts.',
  },
  {
    tag: 'Businesses',
    q: 'What if a student doesn\'t show up?',
    a: 'Report the incident via the Contact page with the shift details and we\'ll investigate. Confirmed no-shows may result in the student\'s account being suspended. We take reliability seriously on both sides.',
  },
  {
    tag: 'Businesses',
    q: 'How do I verify a student\'s right to work?',
    a: 'It is the business\'s responsibility to verify that any worker has the legal right to work in Spain before they begin a shift, in accordance with Spanish employment law. Pick a Shift does not verify right-to-work documentation.',
  },
  // Payments
  {
    tag: 'Payments',
    q: 'How does payment work?',
    a: 'Payment is agreed between the student and the business at the rate shown on the shift listing. Pick a Shift does not currently process payments — businesses pay students directly after the shift.',
  },
  {
    tag: 'Payments',
    q: 'When should I expect to be paid?',
    a: 'Payment terms are set by the individual business. Discuss payment timing with the business before the shift if it\'s not specified on the listing.',
  },
  {
    tag: 'Payments',
    q: 'What if I have a payment dispute?',
    a: (
      <>
        First, contact the business through the platform messaging. If unresolved,{' '}
        <Link href="/contact" className="text-brand hover:underline">
          contact us
        </Link>{' '}
        with your shift details and we'll look into it. Businesses that repeatedly fail to pay
        may be removed from the platform.
      </>
    ),
  },
  // Safety
  {
    tag: 'Safety',
    q: 'How are businesses vetted?',
    a: 'Businesses complete a profile with their registered company details. We review new business accounts before they can post shifts. Students can also leave reviews after each shift — businesses with poor feedback are monitored.',
  },
  {
    tag: 'Safety',
    q: 'What should I do if I feel unsafe during a shift?',
    a: 'Leave the situation if you feel your safety is at risk. Contact emergency services (112 in Spain) if necessary. Once you\'re safe, report the incident via the Contact page. We take safety reports seriously and will investigate immediately.',
  },
  {
    tag: 'Safety',
    q: 'How do I report inappropriate conduct?',
    a: (
      <>
        Use our{' '}
        <Link href="/contact" className="text-brand hover:underline">
          Contact page
        </Link>{' '}
        to report any conduct that violates our Terms of Service — harassment, discrimination,
        non-payment, or any behaviour that made you feel unsafe. Include dates and any relevant
        details.
      </>
    ),
  },
];

const TAGS = ['All', ...Array.from(new Set(FAQS.map((f) => f.tag)))];

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-0">
      <button
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-ink group-hover:text-brand transition-colors">
          {faq.q}
        </span>
        <ChevronDown
          className={`shrink-0 size-4 text-muted-foreground mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-5 text-muted-foreground leading-relaxed">{faq.a}</div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeTag, setActiveTag] = useState('All');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = activeTag === 'All' ? FAQS : FAQS.filter((f) => f.tag === activeTag);

  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            Support
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Quick answers to the most common questions. Need more detail?{' '}
            <Link href="/help" className="text-brand hover:underline">
              Visit the Help Center
            </Link>
            .
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setOpenIdx(null); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTag === tag
                  ? 'bg-brand text-white'
                  : 'bg-card border border-line text-muted-foreground hover:border-brand/40 hover:text-brand'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div className="bg-card border border-line rounded-2xl px-6">
          {filtered.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have a question?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/help"
              className="bg-card border border-line rounded-xl px-6 py-3 font-semibold text-sm hover:border-brand/40 transition-colors"
            >
              Browse Help Center
            </Link>
            <Link
              href="/contact"
              className="bg-brand !text-white rounded-xl px-6 py-3 font-semibold text-sm hover:bg-brand-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

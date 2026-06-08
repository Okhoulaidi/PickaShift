'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, BookOpen, Users, Building2, CreditCard, ShieldCheck, Flag } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE } from '@/lib/site';

type Article = { q: string; a: string };
type Category = {
  icon: React.ElementType;
  title: string;
  id: string;
  articles: Article[];
};

const CATEGORIES: Category[] = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    id: 'getting-started',
    articles: [
      {
        q: 'What is Pick a Shift?',
        a: 'Pick a Shift is a marketplace that connects students in Madrid with businesses offering short-term, flexible shift work in hospitality, retail, events, and more. Students browse open shifts, apply in one tap, and track their earnings. Businesses post shifts and manage applicants — all in one place.',
      },
      {
        q: 'Who can use Pick a Shift?',
        a: 'Students who are 18 or older and have the legal right to work in Spain can sign up as students. Any legally registered business operating in Madrid can sign up to post shifts. Both roles require completing an onboarding profile before accessing the platform.',
      },
      {
        q: 'Is Pick a Shift free to use?',
        a: 'Browsing shifts and creating a student profile is free. Business pricing details are available on our pricing page. We never charge students a commission on their earnings.',
      },
      {
        q: 'How do I create an account?',
        a: 'Click "Get Started" on the homepage and choose your role — Student or Business. You\'ll sign up with your email and complete a short onboarding profile. The whole process takes under 5 minutes.',
      },
    ],
  },
  {
    icon: Users,
    title: 'For Students',
    id: 'for-students',
    articles: [
      {
        q: 'How do I find and apply for shifts?',
        a: 'Once your profile is complete, go to Browse Shifts. You can filter by district, date, pay rate, and skills. Click any shift to see full details, then hit "Apply" to submit your application. The business will review your profile and accept or decline.',
      },
      {
        q: 'What happens after I apply?',
        a: 'Your application status will show as "Pending" in your Applications tab. Once the business reviews it, you\'ll receive a notification whether you\'ve been accepted or not. If accepted, you\'ll be able to message the business directly for any shift-specific details.',
      },
      {
        q: 'Can I cancel an application or accepted shift?',
        a: 'You can withdraw a pending application at any time. If you\'ve already been accepted, please cancel as early as possible — ideally at least 24 hours before the shift. Repeated last-minute cancellations may affect your reliability score and future applications.',
      },
      {
        q: 'What is a reliability score?',
        a: 'Your reliability score reflects how consistently you\'ve shown up to and completed accepted shifts. It\'s visible to businesses reviewing your application and helps you stand out. A higher score significantly improves your chances of being accepted.',
      },
      {
        q: 'How do I upload my CV?',
        a: 'Go to your Dashboard and click "CV" in the sidebar. You can upload a PDF. Businesses can view your CV when reviewing your application if you\'ve uploaded one. It\'s optional but recommended for more competitive shifts.',
      },
      {
        q: 'How are earnings tracked?',
        a: 'Once a business marks a shift as completed, the pay for that shift is added to your earnings total in the Earnings section of your dashboard. This is a running record — Pick a Shift does not currently process direct payments. Your business pays you directly as agreed.',
      },
    ],
  },
  {
    icon: Building2,
    title: 'For Businesses',
    id: 'for-businesses',
    articles: [
      {
        q: 'How do I post a shift?',
        a: 'From your business dashboard, click "Post a Shift". Fill in the details — role, date, start and end time, location, pay rate, required skills, and any specific requirements. You can also mark a shift as urgent. Once published, it\'s live on Browse immediately.',
      },
      {
        q: 'How do I review applicants?',
        a: 'Go to the Applicants section or open a specific shift from your Shifts page. You\'ll see all applications with each student\'s profile, university, skills, reliability score, and CV if uploaded. Accept or decline applications from there.',
      },
      {
        q: 'Can I message students?',
        a: 'Yes. Once you accept a student\'s application, a conversation thread is opened automatically. You can use this to share meeting points, shift-specific instructions, or confirm details.',
      },
      {
        q: 'What is the Talent Pool?',
        a: 'The Talent Pool lets you save students you\'ve worked with and want to hire again. Add students directly from their profile. You can browse your saved pool and reach out proactively for future shifts.',
      },
      {
        q: 'How do I mark a shift as completed?',
        a: 'After the shift date has passed, open the shift from your dashboard and mark it as completed. This updates the student\'s earnings record and triggers the review flow for both parties.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Earnings',
    id: 'payments',
    articles: [
      {
        q: 'How does payment work?',
        a: 'Payment is handled directly between you and the business — Pick a Shift does not process or hold payments. The pay rate is agreed on the shift listing. Once the shift is completed and marked as such by the business, it appears in your earnings record.',
      },
      {
        q: 'What if a business hasn\'t paid me?',
        a: 'If a business has not paid you for a completed shift, first contact them directly via the platform messaging. If the issue is not resolved, report it through the Contact page and include your shift ID. We take payment disputes seriously and may investigate and remove the business from the platform.',
      },
      {
        q: 'Are there any fees for students?',
        a: 'No. Students pay nothing to use Pick a Shift. We never take a cut of your shift earnings.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Account & Security',
    id: 'account-security',
    articles: [
      {
        q: 'How do I update my profile?',
        a: 'Go to your Dashboard and click "Profile" in the sidebar. Students can update their bio, skills, district, availability, and name. Businesses can update their description, logo, contact info, and address.',
      },
      {
        q: 'I forgot my password. What do I do?',
        a: 'On the sign-in page, click "Forgot password" and enter your email address. You\'ll receive a reset link within a few minutes. Check your spam folder if it doesn\'t arrive.',
      },
      {
        q: 'How do I delete my account?',
        a: `To delete your account, contact us at ${SITE.emails.hello} with the subject "Account Deletion Request". We'll process the request within 7 days. Please note that deletion is permanent — your profile, shift history, and messages will be removed.`,
      },
      {
        q: 'My account has been suspended. What now?',
        a: `If your account has been suspended, you'll see a notice when you log in. Suspension usually follows a serious breach of our Terms of Service. Contact us at ${SITE.emails.hello} to appeal. We review all appeals within 5 business days.`,
      },
    ],
  },
  {
    icon: Flag,
    title: 'Reporting Issues',
    id: 'reporting',
    articles: [
      {
        q: 'How do I report a business or student?',
        a: 'If you\'ve had a problem with another user — unprofessional conduct, no-show, non-payment, or harassment — contact us via the Contact page. Include the username or business name, the shift date, and a brief description. We investigate all reports.',
      },
      {
        q: 'I found a bug or technical problem. How do I report it?',
        a: 'Use the Contact page and select "Technical Issue" as the subject. Describe what you were doing, what you expected to happen, and what happened instead. Screenshots are very helpful. We aim to respond within 24 hours.',
      },
      {
        q: 'Can I dispute a review left about me?',
        a: 'Reviews cannot be edited once submitted. If you believe a review is factually inaccurate, abusive, or violates our Terms, contact us and we\'ll investigate. We may remove reviews that breach our guidelines, but we do not remove reviews simply because you disagree with the assessment.',
      },
    ],
  },
];

function Accordion({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line">
      {articles.map((a, i) => (
        <div key={i}>
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
  return (
    <div className="bg-canvas min-h-screen font-manrope text-ink">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand mb-3 block">
            Support
          </span>
          <h1 className="font-sora text-4xl font-extrabold tracking-tight mb-4">Help Center</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about Pick a Shift. Can't find what you're looking for?{' '}
            <Link href="/contact" className="text-brand hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>

        {/* Category nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-14">
          {CATEGORIES.map((c) => (
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
                {c.articles.length} articles
              </span>
            </a>
          ))}
        </div>

        {/* Category sections */}
        <div className="space-y-14">
          {CATEGORIES.map((c) => (
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

        {/* Still need help */}
        <div className="mt-16 bg-brand text-white rounded-2xl p-8 text-center">
          <h3 className="font-sora font-bold text-xl mb-2">Still need help?</h3>
          <p className="text-brand-light/90 mb-6">
            Our team is based in Madrid and responds within 24 hours on business days.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white !text-brand px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-light transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

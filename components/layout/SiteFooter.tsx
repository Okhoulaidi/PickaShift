'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

export function SiteFooter() {
  const t = useTranslations('footer');

  const FOOTER_COLS: [string, { label: string; href: string }[]][] = [
    [
      t('platform'),
      [
        { label: t('browseShifts'), href: '/browse' },
        { label: t('postShift'), href: '/sign-up?role=business' },
        { label: t('howItWorks'), href: '/#how' },
        { label: t('faq'), href: '/faq' },
      ],
    ],
    [
      t('support'),
      [
        { label: t('helpCenter'), href: '/help' },
        { label: t('contact'), href: '/contact' },
        { label: t('privacyPolicy'), href: '/privacy' },
        { label: t('termsOfService'), href: '/terms' },
      ],
    ],
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo className="logo" />
            <p>{t('tagline')}</p>
            <div className="socials">
              <a href="#" aria-label={t('instagram')}>
                <Icon name="insta" size={19} />
              </a>
              <a href="#" aria-label={t('x')}>
                <Icon name="x_social" size={19} />
              </a>
              <a href="#" aria-label={t('linkedin')}>
                <Icon name="linkedin" size={19} />
              </a>
            </div>
          </div>
          {FOOTER_COLS.map(([heading, items]) => (
            <div className="foot-col" key={heading}>
              <h5>{heading}</h5>
              {items.map(({ label, href }) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{t('copyright')}</span>
          <span className="footer-made">
            {t('madeWith')}
            <Icon name="heart" size={14} fill style={{ color: 'var(--primary)' }} />
            {t('forStudents')}
          </span>
        </div>
      </div>
    </footer>
  );
}

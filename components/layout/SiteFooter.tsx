import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

const FOOTER_COLS: [string, { label: string; href: string }[]][] = [
  [
    'Platform',
    [
      { label: 'Browse Shifts', href: '/browse' },
      { label: 'Post a Shift', href: '/sign-up?role=business' },
      { label: 'How it Works', href: '/#how' },
      { label: 'FAQ', href: '/faq' },
    ],
  ],
  [
    'Support',
    [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  ],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo className="logo" />
            <p>
              Flexible short-term shifts for students in Madrid. Pick one. Work it. Get paid.
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <Icon name="insta" size={19} />
              </a>
              <a href="#" aria-label="X">
                <Icon name="x_social" size={19} />
              </a>
              <a href="#" aria-label="LinkedIn">
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
          <span>© 2026 Pick a Shift · Madrid, España</span>
          <span className="footer-made">
            Hecho con
            <Icon name="heart" size={14} fill style={{ color: 'var(--primary)' }} />
            para estudiantes
          </span>
        </div>
      </div>
    </footer>
  );
}

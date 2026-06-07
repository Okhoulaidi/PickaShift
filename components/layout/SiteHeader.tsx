'use client';

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

const NAV_LINKS = [
  { label: 'How it Works', href: '/#how' },
  { label: 'For Students', href: '/dashboard' },
  { label: 'For Business', href: '/biz/dashboard' },
] as const;

export interface SiteHeaderProps {
  active?: string;
}

function AuthActions({ mobile }: { mobile?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div style={mobile ? { display: 'flex', justifyContent: 'center', padding: '8px 0' } : undefined}>
        <UserButton />
      </div>
    );
  }

  const loginClass = mobile ? 'btn btn-outline btn-block' : 'btn btn-ghost';
  const signupClass = mobile ? 'btn btn-primary btn-block' : 'btn btn-primary';

  return (
    <>
      <SignInButton mode="modal">
        <button type="button" className={loginClass}>
          Log In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button type="button" className={signupClass}>
          Sign Up
        </button>
      </SignUpButton>
    </>
  );
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap">
        <Logo />
        <nav className="nav-center">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`nav-link${active === label ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <AuthActions />
          <button
            type="button"
            className="btn btn-icon btn-outline hamburger"
            aria-label="Menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      <div className={`mobile-sheet${open ? ' open' : ''}`}>
        <div className="scrim" onClick={() => setOpen(false)} aria-hidden />
        <div className="panel">
          <div className="m-top">
            <Logo className="logo logo-sm" />
            <button type="button" className="close-x" onClick={() => setOpen(false)} aria-label="Close menu">
              <Icon name="x" size={20} />
            </button>
          </div>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="m-link"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="m-actions">
            <AuthActions mobile />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

const PUBLIC_NAV_LINKS = [
  { label: 'How it Works', href: '/#how' },
  { label: 'For Students', href: '/sign-up?role=student' },
  { label: 'For Business', href: '/sign-up?role=business' },
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
      <Link href="/sign-up?role=student" className={signupClass}>
        Sign Up
      </Link>
    </>
  );
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const navLinks = isSignedIn ? [] : PUBLIC_NAV_LINKS;

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
          {navLinks.map(({ label, href }) => (
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
          {!isSignedIn && (
            <button
              type="button"
              className="btn btn-icon btn-outline hamburger"
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={20} />
            </button>
          )}
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
          {navLinks.map(({ label, href }) => (
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

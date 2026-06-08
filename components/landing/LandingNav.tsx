'use client';

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';

export function LandingNav() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-navy/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
        <Logo className="logo scale-90 sm:scale-100 origin-left !text-white [&_.logo-icon]:fill-white" />
        <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-wider text-white/75">
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center">
          {isLoaded && isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold px-3 sm:px-4 py-2 text-white/90 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up?role=student"
                className="bg-brand !text-white text-sm font-semibold px-4 sm:px-5 py-2 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

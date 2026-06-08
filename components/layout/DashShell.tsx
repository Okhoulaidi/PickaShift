'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { useEffect, useState, type ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { NotifBell } from '@/components/layout/NotifBell';
import { navIcon } from '@/lib/nav-icons';
import type { IconName } from '@/components/ui/Icon';

export interface DashNavItem {
  label: string;
  href: string;
  icon: IconName;
  short?: string;
  pill?: string | number;
}

export interface DashUser {
  name: string;
  sub: string;
  initials: string;
  color: string;
}

export interface DashShellProps {
  nav: DashNavItem[];
  active: string;
  user: DashUser;
  children: ReactNode;
  topTitle: string;
  topSub?: string;
  notif?: number;
  variant?: 'student' | 'business';
}

export function DashShell({
  nav,
  active,
  user,
  children,
  topTitle,
  topSub,
  notif = 0,
  variant = 'student',
}: DashShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isBusiness = variant === 'business';
  const notificationsHref = isBusiness ? '/biz/notifications' : '/dashboard/notifications';

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebarBg = isBusiness ? 'bg-ink border-white/10' : 'bg-card border-line';
  const logoClass = isBusiness ? 'logo logo-sm !text-white [&_.logo-icon]:fill-white' : 'logo logo-sm';
  const linkBase = isBusiness
    ? 'text-white/55 hover:bg-white/6 hover:text-white/90'
    : 'text-ink hover:bg-brand-light hover:text-brand';
  const linkActive = isBusiness
    ? 'bg-brand text-white shadow-sm'
    : 'bg-brand text-white shadow-sm';
  const linkIdle = isBusiness
    ? 'hover:bg-white/6 hover:text-white/90'
    : 'hover:bg-brand-light hover:text-brand';

  return (
    <div className={`min-h-screen flex font-manrope ${isBusiness ? 'biz-mode' : ''} bg-canvas text-ink`}>
      <aside
        className={`${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 z-40 h-screen w-64 ${sidebarBg} border-r flex flex-col transition-transform duration-200`}
      >
        <div className={`p-5 border-b ${isBusiness ? 'border-white/10' : 'border-line'}`}>
          <Link href={isBusiness ? '/biz/dashboard' : '/dashboard'} onClick={() => setOpen(false)}>
            <Logo className={logoClass} />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = active === item.label || pathname === item.href;
            const Icon = navIcon(item.icon);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? `${linkActive} biz-nav-active` : `${linkBase} ${linkIdle}`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.pill != null && (
                  <span className="ml-auto bg-brand text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                    {item.pill}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-3 border-t ${isBusiness ? 'border-white/10' : 'border-line'}`}>
          <div
            className={`flex items-center gap-3 p-2 rounded-lg ${
              isBusiness ? 'hover:bg-white/6' : 'hover:bg-muted/40'
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: user.color }}
            >
              {user.initials}
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold truncate ${isBusiness ? 'text-white' : ''}`}>
                {user.name}
              </div>
              <div
                className={`text-xs truncate ${isBusiness ? 'text-white/50' : 'text-muted-foreground'}`}
              >
                {user.sub}
              </div>
            </div>
          </div>
        </div>

        <div className={`px-3 pb-3 ${isBusiness ? 'border-white/10' : 'border-line'}`}>
          <SignOutButton>
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isBusiness
                  ? 'text-white/50 hover:text-white/80 hover:bg-white/6'
                  : 'text-muted-foreground hover:text-ink hover:bg-muted/40'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-canvas/80 backdrop-blur-md border-b border-line px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded-lg border border-line bg-card"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="font-sora text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">
                {topTitle}
              </h1>
              {topSub && (
                <p className="text-sm text-muted-foreground truncate">{topSub}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <NotifBell unreadCount={notif} allHref={notificationsHref} />
            <div
              className="w-10 h-10 rounded-full hidden sm:flex items-center justify-center text-white font-bold text-sm"
              style={{ background: user.color }}
            >
              {user.initials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">{children}</div>
      </main>

      <MobileBottomNav nav={nav} active={active} />
    </div>
  );
}

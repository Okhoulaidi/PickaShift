import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

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
  return (
    <div className={`app${variant === 'business' ? ' biz-mode' : ''}`}>
      <aside className="sidebar">
        <div className="side-logo">
          <Logo className="logo" />
        </div>
        <nav className="side-nav">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={`side-link${active === n.label ? ' active' : ''}`}
            >
              <Icon name={n.icon} size={20} /> {n.label}
              {n.pill != null && <span className="pill">{n.pill}</span>}
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <div className="side-card">
            <div className="sc-row">
              <div className="avatar md" style={{ background: user.color }}>
                {user.initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{user.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{user.sub}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <h1>{topTitle}</h1>
            {topSub && <div className="sub">{topSub}</div>}
          </div>
          <div className="tb-actions">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <Icon name="bell" size={20} />
              {notif > 0 && <span className="notif-dot" />}
            </button>
            <div className="avatar md" style={{ background: user.color }}>
              {user.initials}
            </div>
          </div>
        </div>
        {children}
      </div>

      <MobileBottomNav nav={nav} active={active} />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { DashNavItem } from '@/components/layout/DashShell';

interface MobileBottomNavProps {
  nav: DashNavItem[];
  active: string;
}

export function MobileBottomNav({ nav, active }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = nav.slice(0, 4);
  const overflow = nav.slice(4);
  const overflowActive = overflow.some((n) => n.label === active);
  const overflowHasPill = overflow.some((n) => n.pill != null);

  useEffect(() => {
    document.body.style.overflow = moreOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  return (
    <>
      <nav className="bottom-nav">
        {primary.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className={`bn-link${active === n.label ? ' active' : ''}`}
          >
            {n.pill != null && <span className="bn-dot" />}
            <Icon name={n.icon} size={21} />
            {n.short || n.label}
          </Link>
        ))}
        {overflow.length > 0 && (
          <button
            type="button"
            className={`bn-link${overflowActive ? ' active' : ''}`}
            onClick={() => setMoreOpen(true)}
            aria-label="More navigation"
          >
            {overflowHasPill && <span className="bn-dot" />}
            <Icon name="layers" size={21} />
            More
          </button>
        )}
      </nav>

      {moreOpen && (
        <div className="mobile-sheet open">
          <div className="scrim" onClick={() => setMoreOpen(false)} aria-hidden />
          <div className="panel">
            <div className="m-top">
              <strong style={{ fontSize: 18, fontWeight: 900 }}>More</strong>
              <button type="button" className="close-x" onClick={() => setMoreOpen(false)} aria-label="Close">
                <Icon name="x" size={20} />
              </button>
            </div>
            {overflow.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`m-link${active === n.label ? ' active' : ''}`}
                onClick={() => setMoreOpen(false)}
                style={active === n.label ? { color: 'var(--primary)', fontWeight: 800 } : undefined}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={n.icon} size={20} />
                  {n.label}
                  {n.pill != null && (
                    <span className="pill" style={{ marginLeft: 'auto' }}>
                      {n.pill}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

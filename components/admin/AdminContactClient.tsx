'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { DashShell } from '@/components/layout/DashShell';
import { adminNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { ContactSubmission, DashboardStats } from '@/lib/types';
import { bizColor, initials } from '@/lib/utils';

export function AdminContactClient({
  user,
  stats,
  submissions: initialSubmissions,
}: {
  user: DashUser;
  stats: DashboardStats;
  submissions: ContactSubmission[];
}) {
  const tNav = useTranslations('nav.admin');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <DashShell
      nav={adminNav(tNav, stats.contactSubmissions ?? 0)}
      active={tNav('contact')}
      user={user}
      topTitle="Contact inbox"
      topSub={`${initialSubmissions.length} submission${initialSubmissions.length === 1 ? '' : 's'}`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/businesses">Businesses</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/contact" className="active">
            Contact
          </Link>
        </nav>

        {initialSubmissions.length === 0 ? (
          <div className="empty-state panel">
            <h3>No messages yet</h3>
            <p>Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="panel">
            {initialSubmissions.map((item) => {
              const isOpen = expanded === item.id;
              return (
                <div key={item.id} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                    className="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="avatar md shrink-0"
                        style={{ background: bizColor(item.name) }}
                      >
                        {initials(item.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 justify-between">
                          <div className="font-bold">{item.name}</div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.email}</div>
                        <div className="text-sm font-semibold mt-1">{item.subject}</div>
                        {!isOpen && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {item.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pl-[4.5rem]">
                      <p className="text-sm whitespace-pre-wrap bg-canvas border border-line rounded-xl p-4">
                        {item.message}
                      </p>
                      <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                        className="inline-block mt-3 text-sm font-semibold text-brand hover:underline"
                      >
                        Reply via email →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashShell>
  );
}

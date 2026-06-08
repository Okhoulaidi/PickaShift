'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { verifyBusiness } from '@/lib/actions/admin';
import { adminNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import { bizColor, initials } from '@/lib/utils';
import { unwrapRelation } from '@/lib/types';

interface BusinessRow {
  id: string;
  businessName: string;
  businessType: string;
  district: string;
  email: string;
  contactName: string;
  createdAt: string;
}

export function AdminBusinessesClient({
  user,
  stats,
  businesses,
}: {
  user: DashUser;
  stats: DashboardStats;
  businesses: BusinessRow[];
}) {
  const tNav = useTranslations('nav.admin');
  const [list, setList] = useState(businesses);
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter();

  async function handleVerify(id: string) {
    setLoading(id);
    const result = await verifyBusiness(id);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setList((prev) => prev.filter((b) => b.id !== id));
    show('Business verified');
    router.refresh();
  }

  return (
    <DashShell
      nav={adminNav(tNav, stats.contactSubmissions ?? 0)}
      active={tNav('businesses')}
      user={user}
      topTitle="Business directory"
      topSub={`${list.length} pending manual review (auto-verified at signup)`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/businesses" className="active">
            Businesses
          </Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/contact">Contact</Link>
        </nav>

        {list.length === 0 ? (
          <div className="empty-state panel">
            <h3>No pending reviews</h3>
            <p>New businesses are verified automatically when they complete onboarding.</p>
          </div>
        ) : (
          <div className="panel">
            {list.map((b) => (
              <div className="appl-row" key={b.id} style={{ gridTemplateColumns: '1.5fr 1fr auto' }}>
                <div className="appl-person">
                  <span className="avatar md" style={{ background: bizColor(b.businessName) }}>
                    {initials(b.businessName)}
                  </span>
                  <div>
                    <div className="ap-name">{b.businessName}</div>
                    <div className="ap-sub">
                      {b.businessType} · {b.district} · {b.contactName}
                    </div>
                    <div className="ap-sub">{b.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Submitted {new Date(b.createdAt).toLocaleDateString()}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  disabled={loading === b.id}
                  onClick={() => handleVerify(b.id)}
                >
                  <Icon name="check" size={15} /> Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashShell>
  );
}

export function mapUnverifiedBusinesses(
  rows: Awaited<ReturnType<typeof import('@/lib/queries/users').getUnverifiedBusinesses>>,
): BusinessRow[] {
  return rows.map((b) => {
    const profile = unwrapRelation(b.profile);
    return {
      id: b.id,
      businessName: b.business_name,
      businessType: b.business_type,
      district: b.district,
      email: profile?.email ?? b.public_email ?? '',
      contactName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '—',
      createdAt: profile?.created_at ?? b.id,
    };
  });
}

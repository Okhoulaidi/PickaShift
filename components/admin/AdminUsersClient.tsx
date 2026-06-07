'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { useToast } from '@/components/ui/Toast';
import { suspendUser } from '@/lib/actions/admin';
import { adminNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats, Profile } from '@/lib/types';
import { bizColor, initials } from '@/lib/utils';

export function AdminUsersClient({
  user,
  stats,
  users: initialUsers,
}: {
  user: DashUser;
  stats: DashboardStats;
  users: Profile[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const { show } = useToast();

  async function toggleSuspend(u: Profile) {
    setLoading(u.id);
    const result = await suspendUser(u.id, !u.suspended);
    setLoading(null);
    if (result.error) {
      show(result.error);
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, suspended: !u.suspended } : x)));
    show(u.suspended ? 'User reinstated' : 'User suspended');
  }

  return (
    <DashShell
      nav={adminNav(stats.pendingVerifications ?? 0)}
      active="Users"
      user={user}
      topTitle="Users"
      topSub={`${users.length} registered accounts`}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/businesses">Verifications</Link>
          <Link href="/admin/users" className="active">
            Users
          </Link>
        </nav>

        <div className="panel">
          <div className="appl-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr auto' }}>
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span />
          </div>
          {users.map((u) => {
            const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email;
            return (
              <div className="appl-row" key={u.id} style={{ gridTemplateColumns: '1.5fr 1fr 1fr auto' }}>
                <div className="appl-person">
                  <span className="avatar md" style={{ background: bizColor(name) }}>
                    {initials(name)}
                  </span>
                  <div>
                    <div className="ap-name">{name}</div>
                    <div className="ap-sub">{u.email}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{u.role}</div>
                <div>
                  {u.suspended ? (
                    <span className="badge badge-urgent">Suspended</span>
                  ) : (
                    <span className="badge badge-open">Active</span>
                  )}
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${u.suspended ? 'btn-primary' : 'btn-outline'}`}
                  disabled={loading === u.id}
                  onClick={() => toggleSuspend(u)}
                >
                  {u.suspended ? 'Reinstate' : 'Suspend'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashShell>
  );
}

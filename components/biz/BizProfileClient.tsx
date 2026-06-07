'use client';

import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { useToast } from '@/components/ui/Toast';
import { updateBusinessProfile } from '@/lib/actions/profile';
import { businessNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import { BUSINESS_TYPES, MADRID_DISTRICTS } from '@/lib/constants';

interface BizProfileClientProps {
  user: DashUser;
  stats: DashboardStats;
  initial: {
    businessName: string;
    businessType: string;
    nif: string;
    district: string;
    address: string;
    phone: string;
    publicEmail: string;
    website: string;
    description: string;
    verified: boolean;
  };
}

export function BizProfileClient({ user, stats, initial }: BizProfileClientProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initial);
  const { show } = useToast();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateBusinessProfile({
      businessName: form.businessName,
      businessType: form.businessType,
      nif: form.nif || undefined,
      district: form.district,
      address: form.address || undefined,
      phone: form.phone || undefined,
      publicEmail: form.publicEmail || undefined,
      website: form.website || undefined,
      description: form.description || undefined,
    });
    setLoading(false);
    show(result.error ?? 'Profile updated');
  }

  return (
    <DashShell
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Profile"
      user={user}
      topTitle="Business profile"
      topSub={form.verified ? 'Verified business' : 'Pending verification'}
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <form className="panel panel-body" onSubmit={save} style={{ maxWidth: 640 }}>
          <div className="field">
            <label>Business name</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
              required
            />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Type</label>
              <select
                value={form.businessType}
                onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>NIF / CIF</label>
              <input value={form.nif} onChange={(e) => setForm((f) => ({ ...f, nif: e.target.value }))} />
            </div>
          </div>
          <div className="field">
            <label>District</label>
            <select
              value={form.district}
              onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            >
              {MADRID_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="field">
              <label>Public email</label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={(e) => setForm((f) => ({ ...f, publicEmail: e.target.value }))}
              />
            </div>
          </div>
          <div className="field">
            <label>Website</label>
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </DashShell>
  );
}

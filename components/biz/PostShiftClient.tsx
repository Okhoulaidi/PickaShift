'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { createShift } from '@/lib/actions/shifts';
import { businessNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import { BUSINESS_TYPES, MADRID_DISTRICTS, SKILLS } from '@/lib/constants';

interface PostShiftClientProps {
  user: DashUser;
  stats: DashboardStats;
  defaultDistrict: string;
}

export function PostShiftClient({ user, stats, defaultDistrict }: PostShiftClientProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [district, setDistrict] = useState(defaultDistrict);
  const [address, setAddress] = useState('');
  const [payEuro, setPayEuro] = useState('12');
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);

  function toggleSkill(s: string) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createShift({
      title: title.trim(),
      description: description.trim(),
      district,
      address: address.trim() || undefined,
      shiftDate,
      startTime,
      endTime,
      payPerHourCents: Math.round(parseFloat(payEuro) * 100),
      workersNeeded,
      skillsNeeded: skills,
      isUrgent,
    });
    setLoading(false);

    if (result.error) {
      show(result.error);
      return;
    }

    show('Shift posted successfully!');
    router.push(`/biz/shifts/${result.data!.id}`);
  }

  return (
    <DashShell
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Post a Shift"
      user={user}
      topTitle="Post a new shift"
      topSub="Goes live instantly to workers near you"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <form className="panel panel-body" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
          <div className="field">
            <label>
              Job title <span className="req">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Barista"
              required
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} required />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Start time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="field">
              <label>End time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>District</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                {MADRID_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Pay per hour (€)</label>
              <input
                type="number"
                min="9.26"
                step="0.5"
                value={payEuro}
                onChange={(e) => setPayEuro(e.target.value)}
                required
              />
              <span className="hint">Madrid minimum is €9.26/hr</span>
            </div>
          </div>
          <div className="field">
            <label>Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" />
          </div>
          <div className="field">
            <label>Workers needed</label>
            <input
              type="number"
              min={1}
              max={10}
              value={workersNeeded}
              onChange={(e) => setWorkersNeeded(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="What will the worker do?"
            />
          </div>
          <div className="field">
            <label>Skills needed</label>
            <div className="chips">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip${skills.includes(s) ? ' on' : ''}`}
                  onClick={() => toggleSkill(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
              Mark as urgent
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Icon name="bolt" size={16} fill /> {loading ? 'Posting…' : 'Post shift'}
          </button>
        </form>
      </div>
    </DashShell>
  );
}

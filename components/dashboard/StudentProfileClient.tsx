'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { useToast } from '@/components/ui/Toast';
import { updateStudentProfile } from '@/lib/actions/profile';
import { studentNav } from '@/lib/dashboard-nav';
import type { DashUser } from '@/components/layout/DashShell';
import type { DashboardStats } from '@/lib/types';
import {
  DAYS,
  DAY_LABELS,
  MADRID_DISTRICTS,
  SKILLS,
  SLOTS,
  SLOT_LABELS,
  UNIVERSITIES,
} from '@/lib/constants';

interface ProfileClientProps {
  user: DashUser;
  stats: DashboardStats;
  initial: {
    firstName: string;
    lastName: string;
    university: string;
    degree: string;
    yearOfStudy: number;
    bio: string;
    district: string;
    skills: string[];
    availability: Record<string, string[]>;
  };
}

export function StudentProfileClient({ user, stats, initial }: ProfileClientProps) {
  const tNav = useTranslations('nav.student');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState(initial);

  function toggleSkill(skill: string) {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
    }));
  }

  function toggleAvail(day: string, slot: string) {
    setForm((f) => {
      const current = f.availability[day] ?? [];
      const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...f, availability: { ...f.availability, [day]: next } };
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateStudentProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      university: form.university,
      degree: form.degree,
      yearOfStudy: form.yearOfStudy,
      bio: form.bio || undefined,
      skills: form.skills,
      availability: form.availability,
      district: form.district,
    });
    setLoading(false);
    show(result.error ?? 'Profile updated');
  }

  return (
    <DashShell
      nav={studentNav(tNav, stats.pendingApplications ?? 0)}
      active={tNav('myProfile')}
      user={user}
      topTitle="My profile"
      topSub="Keep your info up to date for better matches"
      notif={stats.unreadNotifications}
    >
      <div className="content">
        <form className="panel panel-body" onSubmit={save}>
          <div className="grid-2">
            <div className="field">
              <label>First name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="e.g. María"
              />
            </div>
            <div className="field">
              <label>Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="e.g. García"
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>University</label>
              <select
                value={form.university}
                onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Degree</label>
              <input
                value={form.degree}
                onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Year of study</label>
              <select
                value={form.yearOfStudy}
                onChange={(e) => setForm((f) => ({ ...f, yearOfStudy: Number(e.target.value) }))}
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
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
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Skills</label>
            <div className="chips">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip${form.skills.includes(s) ? ' on' : ''}`}
                  onClick={() => toggleSkill(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Availability</label>
            {DAYS.map((day) => (
              <div key={day} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{DAY_LABELS[day]}</div>
                <div className="chips">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`chip${(form.availability[day] ?? []).includes(slot) ? ' on' : ''}`}
                      onClick={() => toggleAvail(day, slot)}
                    >
                      {SLOT_LABELS[slot]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </DashShell>
  );
}

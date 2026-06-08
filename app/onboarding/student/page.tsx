'use client';

import { useSession } from '@clerk/nextjs';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/components/ui/Toast';
import { completeStudentOnboarding } from '@/lib/actions/onboarding';
import {
  DAYS,
  DAY_LABELS,
  MADRID_DISTRICTS,
  SKILLS,
  SLOTS,
  SLOT_LABELS,
  SPANISH_LEVELS,
  UNIVERSITIES,
} from '@/lib/constants';

const STEPS = ['Basics', 'Skills', 'Availability'];

export default function StudentOnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const { show } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState<string>(UNIVERSITIES[0]);
  const [degree, setDegree] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [bio, setBio] = useState('');
  const [district, setDistrict] = useState<string>(MADRID_DISTRICTS[0]);
  const [skills, setSkills] = useState<string[]>(['Customer service']);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function toggleAvail(day: string, slot: string) {
    setAvailability((prev) => {
      const current = prev[day] ?? [];
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [day]: next };
    });
  }

  async function submit() {
    if (!firstName.trim() || !lastName.trim()) {
      show('Please enter your first and last name');
      setStep(0);
      return;
    }
    if (!degree.trim()) {
      show('Please enter your degree programme');
      setStep(0);
      return;
    }
    if (skills.length === 0) {
      show('Select at least one skill');
      setStep(1);
      return;
    }

    setLoading(true);
    const result = await completeStudentOnboarding({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      university,
      degree: degree.trim(),
      yearOfStudy,
      bio: bio.trim() || undefined,
      skills,
      languages: { es: SPANISH_LEVELS[4].value },
      availability,
      district,
    });
    setLoading(false);

    if (result.error) {
      show(result.error);
      return;
    }

    await session?.reload();
    window.location.href = '/dashboard';
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 560, width: '100%' }}>
        <Logo className="logo logo-sm" />
        <h1 style={{ fontWeight: 900, fontSize: 26, margin: '20px 0 6px' }}>Set up your student profile</h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 20px' }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

        <div className="onboarding-progress">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`step-dot${i < step ? ' done' : ''}${i === step ? ' current' : ''}`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="grid-2">
              <div className="field">
                <label>
                  First name <span className="req">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. María"
                />
              </div>
              <div className="field">
                <label>
                  Last name <span className="req">*</span>
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. García"
                />
              </div>
            </div>
            <div className="field">
              <label>University</label>
              <select value={university} onChange={(e) => setUniversity(e.target.value)}>
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>
                Degree programme <span className="req">*</span>
              </label>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Economics, Computer Science"
              />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Year of study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Home district</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {MADRID_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Short bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell businesses a bit about yourself…"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <div className="field">
            <label>Your skills</label>
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
        )}

        {step === 2 && (
          <div className="field">
            <label>When are you usually free?</label>
            <p className="hint" style={{ marginBottom: 12 }}>
              Tap slots you&apos;re typically available. You can always change this later.
            </p>
            {DAYS.map((day) => (
              <div key={day} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{DAY_LABELS[day]}</div>
                <div className="chips">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`chip${(availability[day] ?? []).includes(slot) ? ' on' : ''}`}
                      onClick={() => toggleAvail(day, slot)}
                    >
                      {SLOT_LABELS[slot]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={loading} onClick={submit}>
              {loading ? 'Saving…' : 'Complete profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

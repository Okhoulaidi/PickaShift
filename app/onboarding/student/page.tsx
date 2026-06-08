'use client';

import Link from 'next/link';
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

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand transition-colors';
const labelClass = 'block text-sm font-semibold text-ink mb-1.5';
const chipClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
    active
      ? 'bg-brand text-white border-brand'
      : 'border-line bg-canvas text-ink hover:border-brand'
  }`;

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
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12 font-manrope text-ink">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-block mb-8">
          <Logo className="logo logo-sm" />
        </Link>

        <div className="bg-card border border-line rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-black mb-1.5">Set up your student profile</h1>
          <p className="text-muted-foreground text-sm mb-5">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>

          <div className="flex gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-brand' : 'bg-line'
                }`}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    First name <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. María"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Last name <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. García"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>University</label>
                <select
                  className={inputClass}
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Degree programme <span className="text-brand">*</span>
                </label>
                <input
                  className={inputClass}
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Economics, Computer Science"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Year of study</label>
                  <select
                    className={inputClass}
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
                <div>
                  <label className={labelClass}>Home district</label>
                  <select
                    className={inputClass}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {MADRID_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Short bio</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[100px]`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell businesses a bit about yourself…"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <label className={labelClass}>Your skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SKILLS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={chipClass(skills.includes(s))}
                    onClick={() => toggleSkill(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className={labelClass}>When are you usually free?</label>
              <p className="text-xs text-muted-foreground mb-3">
                Tap slots you&apos;re typically available. You can always change this later.
              </p>
              {DAYS.map((day) => (
                <div key={day} className="mb-4">
                  <div className="font-bold text-sm mb-2">{DAY_LABELS[day]}</div>
                  <div className="flex flex-wrap gap-2">
                    {SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={chipClass((availability[day] ?? []).includes(slot))}
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

          <div className="flex gap-2.5 mt-6 justify-end">
            {step > 0 && (
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl border border-line text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition-colors"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors"
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
                disabled={loading}
                onClick={submit}
              >
                {loading ? 'Saving…' : 'Complete profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

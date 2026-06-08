'use client';

import Link from 'next/link';
import { useSession } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/components/ui/Toast';
import { completeStudentOnboarding } from '@/lib/actions/onboarding';
import {
  AVAILABILITY_SLOTS,
  JOB_TYPES,
  LANGUAGES,
  MADRID_DISTRICTS,
  STUDENT_CV_BUCKET,
  UNIVERSITIES,
  VISA_TYPES,
} from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand transition-colors';
const labelClass = 'block text-sm font-semibold text-ink mb-1.5';
const chipClass = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
    active
      ? 'bg-brand text-white border-brand'
      : 'border-line bg-canvas text-ink hover:border-brand'
  }`;
const uploadBoxClass =
  'border-2 border-dashed border-line rounded-xl p-6 text-center text-sm text-muted-foreground cursor-pointer hover:border-brand transition-colors';

async function uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export default function StudentOnboardingPage() {
  const t = useTranslations('onboarding');
  const STEPS = [t('steps.basics'), t('steps.profile'), t('steps.experience')];
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const { show } = useToast();
  const userId = session?.user?.id;

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState<string>(UNIVERSITIES[0]);
  const [degree, setDegree] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [nationality, setNationality] = useState<string>('');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [district, setDistrict] = useState<string>(MADRID_DISTRICTS[0]);

  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [pastExperience, setPastExperience] = useState('');
  const [visaType, setVisaType] = useState<string | null>(null);

  function toggleMulti(value: string, list: string[], setList: (next: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function toggleVisa(value: string) {
    setVisaType((prev) => (prev === value ? null : value));
  }

  async function handleAvatarFile(file: File) {
    if (!userId) {
      show(t('errors.signInPhoto'));
      return;
    }
    setAvatarUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const url = await uploadFile('avatars', `${userId}/avatar.${ext}`, file);
    setAvatarUploading(false);
    if (!url) {
      show(t('errors.photoFailed'));
      return;
    }
    setAvatarUrl(url);
  }

  async function handleCvFile(file: File) {
    if (!userId) {
      show(t('errors.signInCv'));
      return;
    }
    if (file.type !== 'application/pdf') {
      show(t('errors.pdfOnly'));
      return;
    }
    setCvUploading(true);
    const url = await uploadFile(STUDENT_CV_BUCKET, `cvs/${userId}.pdf`, file);
    setCvUploading(false);
    if (!url) {
      show(t('errors.cvFailed'));
      return;
    }
    setCvUrl(url);
    setCvFileName(file.name);
  }

  function validateStep1(): boolean {
    if (!firstName.trim() || !lastName.trim()) {
      show(t('errors.nameRequired'));
      return false;
    }
    if (!degree.trim()) {
      show(t('errors.degreeRequired'));
      return false;
    }
    return true;
  }

  function goNext() {
    if (step === 0 && !validateStep1()) return;
    setStep((s) => s + 1);
  }

  async function submit() {
    if (!validateStep1()) {
      setStep(0);
      return;
    }

    setLoading(true);
    const result = await completeStudentOnboarding({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      university,
      degree: degree.trim(),
      yearOfStudy,
      nationality,
      avatarUrl: avatarUrl ?? undefined,
      languages,
      jobTypes,
      availability,
      district,
      cvUrl: cvUrl ?? undefined,
      pastExperience: pastExperience.trim() || undefined,
      visaType: visaType ?? undefined,
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
          <p className="text-brand text-xs font-bold tracking-widest uppercase mb-2">
            {t('eyebrow')}
          </p>
          <h1 className="text-2xl font-black mb-1.5">{t('title')}</h1>
          <p className="text-muted-foreground text-sm mb-5">{t('subtitle')}</p>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex gap-2 flex-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-brand' : 'bg-line'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {t('stepOf', { current: step + 1, total: STEPS.length })}
            </span>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t('firstName')} <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('firstNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t('lastName')} <span className="text-brand">*</span>
                  </label>
                  <input
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('lastNamePlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('university')}</label>
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
                  {t('degree')} <span className="text-brand">*</span>
                </label>
                <input
                  className={inputClass}
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder={t('degreePlaceholder')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('yearOfStudy')}</label>
                  <select
                    className={inputClass}
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <option key={y} value={y}>
                        {t('year', { year: y })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('nationality')}</label>
                  <input
                    className={inputClass}
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder={t('nationalityPlaceholder')}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t('profilePhoto')}</label>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarFile(file);
                  }}
                />
                <div
                  className={uploadBoxClass}
                  onClick={() => avatarInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleAvatarFile(file);
                  }}
                >
                  {avatarUploading ? (
                    <p>{t('uploading')}</p>
                  ) : avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={t('profilePreviewAlt')}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <p>{t('dragPhoto')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('languages')}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={chipClass(languages.includes(lang))}
                      onClick={() => toggleMulti(lang, languages, setLanguages)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('jobTypes')}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {JOB_TYPES.map((job) => (
                    <button
                      key={job}
                      type="button"
                      className={chipClass(jobTypes.includes(job))}
                      onClick={() => toggleMulti(job, jobTypes, setJobTypes)}
                    >
                      {job}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('availability')}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABILITY_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={chipClass(availability.includes(slot))}
                      onClick={() => toggleMulti(slot, availability, setAvailability)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('homeDistrict')}</label>
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
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t('cv')}</label>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleCvFile(file);
                  }}
                />
                <div
                  className={uploadBoxClass}
                  onClick={() => cvInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleCvFile(file);
                  }}
                >
                  {cvUploading ? (
                    <p>{t('uploading')}</p>
                  ) : cvFileName ? (
                    <p className="text-ink font-medium">{t('cvUploaded', { fileName: cvFileName })}</p>
                  ) : (
                    <p>{t('uploadPdf')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('pastExperience')}</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[100px]`}
                  value={pastExperience}
                  onChange={(e) => setPastExperience(e.target.value)}
                  placeholder={t('pastExperiencePlaceholder')}
                />
              </div>

              <div>
                <label className={labelClass}>{t('visaType')}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {VISA_TYPES.map((visa) => (
                    <button
                      key={visa}
                      type="button"
                      className={chipClass(visaType === visa)}
                      onClick={() => toggleVisa(visa)}
                    >
                      {visa}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2.5 mt-6 justify-between">
            <div>
              {step > 0 && (
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl border border-line text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition-colors"
                  onClick={() => setStep((s) => s - 1)}
                >
                  {t('back')}
                </button>
              )}
            </div>
            <div>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors"
                  onClick={goNext}
                >
                  {t('continue')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
                  disabled={loading}
                  onClick={submit}
                >
                  {loading ? t('saving') : t('createProfile')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

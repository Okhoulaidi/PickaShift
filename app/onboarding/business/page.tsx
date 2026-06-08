'use client';

import Link from 'next/link';
import { useSession } from '@clerk/nextjs';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/components/ui/Toast';
import { completeBusinessOnboarding } from '@/lib/actions/onboarding';
import { BUSINESS_TYPES, MADRID_DISTRICTS } from '@/lib/constants';

const STEPS = ['Business info', 'Location & contact', 'About'];

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand transition-colors';
const labelClass = 'block text-sm font-semibold text-ink mb-1.5';

export default function BusinessOnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const { show } = useToast();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<string>(BUSINESS_TYPES[0] as string);
  const [nif, setNif] = useState('');
  const [district, setDistrict] = useState<string>(MADRID_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  async function submit() {
    if (!businessName.trim()) {
      show('Business name is required');
      setStep(0);
      return;
    }

    setLoading(true);
    const result = await completeBusinessOnboarding({
      businessName: businessName.trim(),
      businessType,
      nif: nif.trim() || undefined,
      district,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      publicEmail: publicEmail.trim() || undefined,
      website: website.trim() || undefined,
      description: description.trim() || undefined,
    });
    setLoading(false);

    if (result.error) {
      show(result.error);
      return;
    }

    await session?.reload();
    window.location.href = '/biz/dashboard';
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12 font-manrope text-ink">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-block mb-8">
          <Logo className="logo logo-sm" />
        </Link>

        <div className="bg-card border border-line rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-black mb-1.5">Set up your business</h1>
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
              <div>
                <label className={labelClass}>
                  Business name <span className="text-brand">*</span>
                </label>
                <input
                  className={inputClass}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Brew & Bean"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business type</label>
                  <select
                    className={inputClass}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>NIF / CIF</label>
                  <input
                    className={inputClass}
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>District</label>
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
              <div>
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 …"
                  />
                </div>
                <div>
                  <label className={labelClass}>Public email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={publicEmail}
                    onChange={(e) => setPublicEmail(e.target.value)}
                    placeholder="hello@yourbusiness.com"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input
                  className={inputClass}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[100px]`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your business do? What should workers know?"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Almost done! Once you complete setup you can start posting shifts immediately.
              </p>
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
                {loading ? 'Saving…' : 'Complete setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

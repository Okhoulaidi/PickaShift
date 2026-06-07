'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/components/ui/Toast';
import { completeBusinessOnboarding } from '@/lib/actions/onboarding';
import { BUSINESS_TYPES, MADRID_DISTRICTS } from '@/lib/constants';

const STEPS = ['Business info', 'Location & contact', 'About'];

export default function BusinessOnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

    router.push('/biz/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 560, width: '100%' }}>
        <Logo className="logo logo-sm" />
        <h1 style={{ fontWeight: 900, fontSize: 26, margin: '20px 0 6px' }}>Set up your business</h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 20px' }}>
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

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
            <div className="field">
              <label>
                Business name <span className="req">*</span>
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Brew & Bean"
              />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Business type</label>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>NIF / CIF</label>
                <input value={nif} onChange={(e) => setNif(e.target.value)} placeholder="Optional" />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
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
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 …" />
              </div>
              <div className="field">
                <label>Public email</label>
                <input
                  type="email"
                  value={publicEmail}
                  onChange={(e) => setPublicEmail(e.target.value)}
                  placeholder="hello@yourbusiness.com"
                />
              </div>
            </div>
            <div className="field">
              <label>Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://…"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your business do? What should workers know?"
              />
            </div>
            <p className="hint">
              Your account will be reviewed by our team before you can post shifts. This usually takes 1–2
              business days.
            </p>
          </>
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
              {loading ? 'Saving…' : 'Submit for verification'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

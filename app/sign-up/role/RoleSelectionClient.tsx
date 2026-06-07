'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { setUserRole } from '@/lib/actions/onboarding';

export default function RoleSelectionClient() {
  const [loading, setLoading] = useState<'student' | 'business' | null>(null);
  const router = useRouter();
  const { show } = useToast();

  async function choose(role: 'student' | 'business') {
    setLoading(role);
    const result = await setUserRole(role);
    setLoading(null);

    if (result.error) {
      show(result.error);
      return;
    }

    router.push(role === 'business' ? '/onboarding/business' : '/onboarding/student');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo className="logo" />
        <h1 style={{ fontWeight: 900, fontSize: 28, margin: '24px 0 8px', letterSpacing: '-.02em' }}>
          How will you use Pick a Shift?
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 8px' }}>
          Choose your account type. This cannot be changed later.
        </p>
        <div className="role-cards">
          <button
            type="button"
            className="role-card"
            disabled={!!loading}
            onClick={() => choose('student')}
          >
            <Icon name="user" size={32} />
            <h3>I&apos;m a student</h3>
            <p>Find flexible shifts and earn between classes</p>
            {loading === 'student' && <span style={{ fontSize: 13, color: 'var(--primary)' }}>Setting up…</span>}
          </button>
          <button
            type="button"
            className="role-card"
            disabled={!!loading}
            onClick={() => choose('business')}
          >
            <Icon name="briefcase" size={32} />
            <h3>I&apos;m a business</h3>
            <p>Post shifts and hire reliable student workers</p>
            {loading === 'business' && <span style={{ fontSize: 13, color: 'var(--primary)' }}>Setting up…</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

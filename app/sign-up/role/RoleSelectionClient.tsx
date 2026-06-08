'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { setUserRole } from '@/lib/actions/onboarding';

interface Props {
  preselectedRole?: 'student' | 'business' | null;
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin"
      aria-hidden
    />
  );
}

export default function RoleSelectionClient({ preselectedRole }: Props) {
  const [loading, setLoading] = useState<'student' | 'business' | null>(null);
  const [autoFailed, setAutoFailed] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);
  const router = useRouter();
  const { show } = useToast();

  async function choose(role: 'student' | 'business') {
    setLoading(role);
    setAutoError(null);
    const result = await setUserRole(role);
    setLoading(null);

    if (result.error) {
      show(result.error);
      if (preselectedRole) {
        setAutoFailed(true);
        setAutoError(result.error);
      }
      return;
    }

    router.push(role === 'business' ? '/onboarding/business' : '/onboarding/student');
  }

  useEffect(() => {
    if (!preselectedRole || autoFailed) return;
    void Promise.resolve().then(() => choose(preselectedRole));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedRole, autoFailed]);

  const cardShell = (children: ReactNode) => (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12 font-manrope text-ink">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-block mb-8">
          <Logo className="logo logo-sm" />
        </Link>
        <div className="bg-card border border-line rounded-2xl p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );

  if (preselectedRole && !autoFailed) {
    return cardShell(
      <div className="py-10 text-center">
        <Spinner />
        <p className="text-muted-foreground text-sm mt-6">Setting up your account…</p>
      </div>,
    );
  }

  const roleCardClass = (role: 'student' | 'business') => {
    const isLoading = loading === role;
    const isDimmed = loading !== null && loading !== role;
    return [
      'flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-colors',
      'hover:border-brand focus-visible:outline-none focus-visible:border-brand',
      isLoading ? 'border-brand bg-brand/5' : 'border-line bg-canvas',
      isDimmed ? 'opacity-40 pointer-events-none' : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  return cardShell(
    <>
      <h1 className="text-2xl font-black mb-1.5">How will you use Pick a Shift?</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Choose your account type. This cannot be changed later.
      </p>

      {autoError && (
        <p role="alert" className="text-brand text-sm font-semibold mb-4">
          {autoError} Please choose your account type below.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={roleCardClass('student')}
          disabled={!!loading}
          onClick={() => choose('student')}
        >
          <Icon name="user" size={32} />
          <h3 className="font-bold text-base text-ink">I&apos;m looking for shifts</h3>
          <p className="text-sm text-muted-foreground">Find flexible work between classes</p>
          {loading === 'student' && <Spinner />}
        </button>
        <button
          type="button"
          className={roleCardClass('business')}
          disabled={!!loading}
          onClick={() => choose('business')}
        >
          <Icon name="briefcase" size={32} />
          <h3 className="font-bold text-base text-ink">I&apos;m hiring for shifts</h3>
          <p className="text-sm text-muted-foreground">Post shifts and hire student workers</p>
          {loading === 'business' && <Spinner />}
        </button>
      </div>
    </>,
  );
}

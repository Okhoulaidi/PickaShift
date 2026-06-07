import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkMetadata } from '@/lib/auth';
import RoleSelectionClient from './RoleSelectionClient';

export default async function RoleSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { sessionClaims } = await auth();
  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);

  if (meta.role) {
    if (meta.onboardingComplete !== true) {
      if (meta.role === 'business') redirect('/onboarding/business');
      if (meta.role === 'admin') redirect('/admin');
      redirect('/onboarding/student');
    }

    redirect(
      meta.role === 'business' ? '/biz/dashboard'
      : meta.role === 'admin'  ? '/admin'
      : '/dashboard'
    );
  }

  const { role } = await searchParams;
  const preselectedRole = role === 'student' || role === 'business' ? role : null;

  return <RoleSelectionClient preselectedRole={preselectedRole} />;
}

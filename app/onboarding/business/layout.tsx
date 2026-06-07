import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkMetadata } from '@/lib/auth';
import { getBusinessProfile } from '@/lib/queries/business';

export default async function BusinessOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/onboarding/business');

  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);

  if (meta.role === 'student') redirect('/dashboard');
  if (meta.role === 'admin') redirect('/admin');

  const profile = await getBusinessProfile(userId);
  if (profile) redirect('/biz/dashboard');

  return children;
}

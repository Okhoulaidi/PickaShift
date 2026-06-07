import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkMetadata } from '@/lib/auth';
import { getStudentProfile } from '@/lib/queries/student';

export default async function StudentOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/onboarding/student');

  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);

  if (meta.role === 'business') redirect('/biz/dashboard');
  if (meta.role === 'admin') redirect('/admin');

  const profile = await getStudentProfile(userId);
  if (profile) redirect('/dashboard');

  return children;
}

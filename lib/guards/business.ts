import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getBusinessProfile } from '@/lib/queries/business';

export async function requireBusinessProfile() {
  const session = await requireRole(['business']);
  const profile = await getBusinessProfile(session.userId);
  if (!profile) redirect('/onboarding/business');
  return { session, profile };
}

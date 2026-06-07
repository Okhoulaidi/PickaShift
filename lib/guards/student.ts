import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getStudentProfile } from '@/lib/queries/student';

export async function requireStudentProfile() {
  const session = await requireRole(['student']);
  const profile = await getStudentProfile(session.userId);
  if (!profile) redirect('/onboarding/student');
  return { session, profile };
}

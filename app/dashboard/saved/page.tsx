import { redirect } from 'next/navigation';
import { requireStudentProfile } from '@/lib/guards/student';

export const dynamic = 'force-dynamic';

export default async function SavedShiftsPage() {
  await requireStudentProfile();
  redirect('/browse');
}

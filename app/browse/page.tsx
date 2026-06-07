import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { BrowseClient } from '@/components/browse/BrowseClient';
import { getOpenShifts } from '@/lib/queries/shifts';
import { getStudentAppliedShiftIds } from '@/lib/queries/users';
import type { ShiftWithBusiness } from '@/lib/types';

export default async function BrowsePage() {
  const { userId } = await auth();
  const shifts = (await getOpenShifts({ limit: 50 })) as ShiftWithBusiness[];
  const appliedIds = userId ? [...(await getStudentAppliedShiftIds(userId))] : [];

  return (
    <Suspense>
      <BrowseClient shifts={shifts} appliedIds={appliedIds} />
    </Suspense>
  );
}

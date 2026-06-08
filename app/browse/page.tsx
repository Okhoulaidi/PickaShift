import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { BrowseClient } from '@/components/browse/BrowseClient';
import { getClerkMetadata } from '@/lib/auth';
import { studentDashUser } from '@/lib/dashboard-user';
import { studentNav } from '@/lib/dashboard-nav';
import { getDashboardStats, getOpenShifts } from '@/lib/queries/shifts';
import { getStudentAppliedShiftIds, getStudentProfile } from '@/lib/queries/users';
import { unwrapRelation } from '@/lib/types';
import type { ShiftWithBusiness } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BrowsePage() {
  const tNav = await getTranslations('nav.student');
  const { userId, sessionClaims } = await auth();
  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);

  const shifts = (await getOpenShifts({ limit: 50 })) as ShiftWithBusiness[];
  const appliedIds = userId ? [...(await getStudentAppliedShiftIds(userId))] : [];

  let shell: {
    user: ReturnType<typeof studentDashUser>;
    nav: ReturnType<typeof studentNav>;
    notif: number;
  } | null = null;

  if (userId && meta.role === 'student') {
    const [stats, student] = await Promise.all([
      getDashboardStats('student', userId),
      getStudentProfile(userId),
    ]);
    const profile = unwrapRelation(student?.profile);
    shell = {
      user: studentDashUser(
        {
          first_name: profile?.first_name ?? null,
          last_name: profile?.last_name ?? null,
        },
        student,
      ),
      nav: studentNav(tNav, stats.pendingApplications ?? 0),
      notif: stats.unreadNotifications ?? 0,
    };
  }

  return (
    <Suspense>
      <BrowseClient shifts={shifts} appliedIds={appliedIds} shell={shell} />
    </Suspense>
  );
}

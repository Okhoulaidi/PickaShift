import { requireRole } from '@/lib/auth';
import { PostShiftClient } from '@/components/biz/PostShiftClient';
import { businessDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile } from '@/lib/queries/users';

export default async function NewShiftPage() {
  const session = await requireRole(['business']);
  const [stats, business] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
  ]);

  if (!business) return null;

  return (
    <PostShiftClient
      user={businessDashUser(business)}
      stats={stats}
      defaultDistrict={business.district}
    />
  );
}

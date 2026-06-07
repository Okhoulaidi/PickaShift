import { PostShiftClient } from '@/components/biz/PostShiftClient';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';

export const dynamic = 'force-dynamic';

export default async function NewShiftPage() {
  const { session, profile: business } = await requireBusinessProfile();
  const stats = await getDashboardStats('business', session.userId);

  return (
    <PostShiftClient
      user={businessDashUser(business)}
      stats={stats}
      defaultDistrict={business.district}
    />
  );
}

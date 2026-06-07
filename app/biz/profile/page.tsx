import { requireRole } from '@/lib/auth';
import { BizProfileClient } from '@/components/biz/BizProfileClient';
import { businessDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getBusinessProfile } from '@/lib/queries/users';

export default async function BizProfilePage() {
  const session = await requireRole(['business']);
  const [stats, business] = await Promise.all([
    getDashboardStats('business', session.userId),
    getBusinessProfile(session.userId),
  ]);

  if (!business) return null;

  return (
    <BizProfileClient
      user={businessDashUser(business)}
      stats={stats}
      initial={{
        businessName: business.business_name,
        businessType: business.business_type,
        nif: business.nif ?? '',
        district: business.district,
        address: business.address ?? '',
        phone: business.phone ?? '',
        publicEmail: business.public_email ?? '',
        website: business.website ?? '',
        description: business.description ?? '',
        verified: business.verified,
      }}
    />
  );
}

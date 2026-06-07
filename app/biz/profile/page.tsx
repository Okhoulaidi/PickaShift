import { BizProfileClient } from '@/components/biz/BizProfileClient';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getDashboardStats } from '@/lib/queries/shifts';

export default async function BizProfilePage() {
  const { session, profile: business } = await requireBusinessProfile();
  const stats = await getDashboardStats('business', session.userId);

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

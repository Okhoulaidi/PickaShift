import { requireRole } from '@/lib/auth';
import { AdminBusinessesClient, mapUnverifiedBusinesses } from '@/components/admin/AdminBusinessesClient';
import { adminNav } from '@/lib/dashboard-nav';
import { adminDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getUnverifiedBusinesses } from '@/lib/queries/users';
import { getProfile } from '@/lib/auth';

export default async function AdminBusinessesPage() {
  const session = await requireRole(['admin']);
  const [stats, businesses, profile] = await Promise.all([
    getDashboardStats('admin', session.userId),
    getUnverifiedBusinesses(),
    getProfile(session.userId),
  ]);

  const user = adminDashUser({
    first_name: profile?.first_name ?? session.user.firstName,
    last_name: profile?.last_name ?? session.user.lastName,
    email: profile?.email ?? session.user.emailAddresses[0]?.emailAddress ?? '',
  });

  return (
    <AdminBusinessesClient
      user={user}
      stats={stats}
      businesses={mapUnverifiedBusinesses(businesses)}
    />
  );
}

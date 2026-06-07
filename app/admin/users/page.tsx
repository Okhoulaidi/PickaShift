import { requireRole } from '@/lib/auth';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';
import { adminDashUser } from '@/lib/dashboard-user';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getAllProfiles } from '@/lib/queries/users';
import { getProfile } from '@/lib/auth';

export default async function AdminUsersPage() {
  const session = await requireRole(['admin']);
  const [stats, users, profile] = await Promise.all([
    getDashboardStats('admin', session.userId),
    getAllProfiles(),
    getProfile(session.userId),
  ]);

  const user = adminDashUser({
    first_name: profile?.first_name ?? session.user.firstName,
    last_name: profile?.last_name ?? session.user.lastName,
    email: profile?.email ?? session.user.emailAddresses[0]?.emailAddress ?? '',
  });

  return <AdminUsersClient user={user} stats={stats} users={users} />;
}

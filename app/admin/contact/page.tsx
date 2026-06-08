import { requireRole } from '@/lib/auth';
import { AdminContactClient } from '@/components/admin/AdminContactClient';
import { adminDashUser } from '@/lib/dashboard-user';
import { getContactSubmissions } from '@/lib/queries/contact';
import { getDashboardStats } from '@/lib/queries/shifts';
import { getProfile } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminContactPage() {
  const session = await requireRole(['admin']);
  const [stats, submissions, profile] = await Promise.all([
    getDashboardStats('admin', session.userId),
    getContactSubmissions(),
    getProfile(session.userId),
  ]);

  const user = adminDashUser({
    first_name: profile?.first_name ?? session.user.firstName,
    last_name: profile?.last_name ?? session.user.lastName,
    email: profile?.email ?? session.user.emailAddresses[0]?.emailAddress ?? '',
  });

  return <AdminContactClient user={user} stats={stats} submissions={submissions} />;
}

import { MessagesListClient } from '@/components/messages/MessagesClient';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getConversations, getLastMessagePreview } from '@/lib/queries/messages';
import { getDashboardStats } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function StudentMessagesPage() {
  const { session, profile: student } = await requireStudentProfile();
  const [stats, conversations] = await Promise.all([
    getDashboardStats('student', session.userId),
    getConversations(session.userId, 'student'),
  ]);

  const profile = unwrapRelation(student.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  const items = await Promise.all(
    conversations.map(async (c) => {
      const biz = unwrapRelation(c.business);
      const shift = unwrapRelation(c.shift);
      const preview = await getLastMessagePreview(c.id);
      return {
        id: c.id,
        title: shift?.title ?? 'Shift',
        partnerName: biz?.business_name ?? 'Business',
        lastMessageAt: c.last_message_at,
        preview: preview?.body,
      };
    }),
  );

  return (
    <MessagesListClient
      nav={studentNav(stats.pendingApplications ?? 0)}
      active="Messages"
      user={user}
      topTitle="Messages"
      conversations={items}
      basePath="/dashboard/messages"
      notif={stats.unreadNotifications}
    />
  );
}

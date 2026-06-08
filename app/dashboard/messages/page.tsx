import { MessagesListClient } from '@/components/messages/MessagesClient';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getConversations, getLastMessagePreviews } from '@/lib/queries/messages';
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

  const previews = await getLastMessagePreviews(conversations.map((c) => c.id));

  const items = conversations.map((c) => {
    const biz = unwrapRelation(c.business);
    const shift = unwrapRelation(c.shift);
    return {
      id: c.id,
      title: shift?.title ?? 'Shift',
      partnerName: biz?.business_name ?? 'Business',
      lastMessageAt: c.last_message_at,
      preview: previews[c.id]?.body,
    };
  });

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

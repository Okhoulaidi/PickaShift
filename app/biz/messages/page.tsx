import { MessagesListClient } from '@/components/messages/MessagesClient';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getConversations, getLastMessagePreview } from '@/lib/queries/messages';
import { getDashboardStats } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export default async function BizMessagesPage() {
  const { session, profile: business } = await requireBusinessProfile();
  const [stats, conversations] = await Promise.all([
    getDashboardStats('business', session.userId),
    getConversations(session.userId, 'business'),
  ]);

  const user = businessDashUser(business);

  const items = await Promise.all(
    conversations.map(async (c) => {
      const student = unwrapRelation(c.student);
      const profile = student ? unwrapRelation(student.profile) : null;
      const shift = unwrapRelation(c.shift);
      const preview = await getLastMessagePreview(c.id);
      const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student';
      return {
        id: c.id,
        title: shift?.title ?? 'Shift',
        partnerName: name,
        lastMessageAt: c.last_message_at,
        preview: preview?.body,
      };
    }),
  );

  return (
    <MessagesListClient
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Messages"
      user={user}
      topTitle="Messages"
      conversations={items}
      basePath="/biz/messages"
      notif={stats.unreadNotifications}
      variant="business"
    />
  );
}

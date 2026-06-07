import { notFound } from 'next/navigation';
import { MessageThreadClient } from '@/components/messages/MessagesClient';
import { businessNav } from '@/lib/dashboard-nav';
import { businessDashUser } from '@/lib/dashboard-user';
import { requireBusinessProfile } from '@/lib/guards/business';
import { getConversationById, getMessages } from '@/lib/queries/messages';
import { getDashboardStats } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BizMessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session, profile: business } = await requireBusinessProfile();

  const conversation = await getConversationById(id, session.userId, 'business');
  if (!conversation) notFound();

  const [stats, messages] = await Promise.all([
    getDashboardStats('business', session.userId),
    getMessages(id),
  ]);

  const student = unwrapRelation(conversation.student);
  const profile = student ? unwrapRelation(student.profile) : null;
  const shift = unwrapRelation(conversation.shift);
  const partnerName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student';

  const mapped = messages.map((m) => {
    const sender = unwrapRelation(m.sender);
    const senderName = [sender?.first_name, sender?.last_name].filter(Boolean).join(' ') || 'User';
    return {
      id: m.id,
      body: m.body,
      sentAt: m.sent_at,
      isMine: m.sender_id === session.userId,
      senderName,
    };
  });

  return (
    <MessageThreadClient
      nav={businessNav(stats.openShifts ?? 0, stats.pendingReview ?? 0)}
      active="Messages"
      user={businessDashUser(business)}
      conversationId={id}
      partnerName={partnerName}
      shiftTitle={shift?.title ?? 'Shift'}
      messages={mapped}
      basePath="/biz/messages"
      notif={stats.unreadNotifications}
      variant="business"
    />
  );
}

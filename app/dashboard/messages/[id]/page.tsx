import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MessageThreadClient } from '@/components/messages/MessagesClient';
import { studentNav } from '@/lib/dashboard-nav';
import { studentDashUser } from '@/lib/dashboard-user';
import { requireStudentProfile } from '@/lib/guards/student';
import { getConversationById, getMessages } from '@/lib/queries/messages';
import { getDashboardStats } from '@/lib/queries/shifts';
import { unwrapRelation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function StudentMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tNav = await getTranslations('nav.student');
  const { session, profile: student } = await requireStudentProfile();

  const conversation = await getConversationById(id, session.userId, 'student');
  if (!conversation) notFound();

  const [stats, messages] = await Promise.all([
    getDashboardStats('student', session.userId),
    getMessages(id),
  ]);

  const profile = unwrapRelation(student.profile);
  const user = studentDashUser(
    {
      first_name: profile?.first_name ?? session.user.firstName,
      last_name: profile?.last_name ?? session.user.lastName,
    },
    student,
  );

  const biz = unwrapRelation(conversation.business);
  const shift = unwrapRelation(conversation.shift);

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
      nav={studentNav(tNav, stats.pendingApplications ?? 0)}
      active={tNav('messages')}
      user={user}
      conversationId={id}
      partnerName={biz?.business_name ?? 'Business'}
      shiftTitle={shift?.title ?? 'Shift'}
      messages={mapped}
      basePath="/dashboard/messages"
      notif={stats.unreadNotifications}
    />
  );
}

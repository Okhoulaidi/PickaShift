'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashShell } from '@/components/layout/DashShell';
import { useToast } from '@/components/ui/Toast';
import { sendMessage } from '@/lib/actions/messages';
import type { DashNavItem, DashUser } from '@/components/layout/DashShell';
import { bizColor, initials } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface ConversationItem {
  id: string;
  title: string;
  partnerName: string;
  lastMessageAt: string;
  preview?: string;
}

interface MessageItem {
  id: string;
  body: string;
  sentAt: string;
  isMine: boolean;
  senderName: string;
}

interface MessagesListClientProps {
  nav: DashNavItem[];
  active: string;
  user: DashUser;
  topTitle: string;
  conversations: ConversationItem[];
  basePath: string;
  notif?: number;
}

export function MessagesListClient({
  nav,
  active,
  user,
  topTitle,
  conversations,
  basePath,
  notif,
}: MessagesListClientProps) {
  return (
    <DashShell nav={nav} active={active} user={user} topTitle={topTitle} notif={notif}>
      <div className="content">
        {conversations.length === 0 ? (
          <div className="empty-state panel">
            <h3>No messages yet</h3>
            <p>Messages appear when a business accepts your application.</p>
          </div>
        ) : (
          <div className="panel">
            <div className="up-list" style={{ padding: '0 22px' }}>
              {conversations.map((c) => (
                <Link href={`${basePath}/${c.id}`} className="up-item" key={c.id} style={{ display: 'flex' }}>
                  <div className="avatar md" style={{ background: bizColor(c.partnerName) }}>
                    {initials(c.partnerName)}
                  </div>
                  <div className="up-info">
                    <div className="u-title">{c.partnerName}</div>
                    <div className="u-meta">{c.title}</div>
                    {c.preview && <div className="msg-preview">{c.preview}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {format(parseISO(c.lastMessageAt), 'd MMM')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashShell>
  );
}

interface MessageThreadClientProps {
  nav: DashNavItem[];
  active: string;
  user: DashUser;
  conversationId: string;
  partnerName: string;
  shiftTitle: string;
  messages: MessageItem[];
  basePath: string;
  notif?: number;
}

export function MessageThreadClient({
  nav,
  active,
  user,
  conversationId,
  partnerName,
  shiftTitle,
  messages: initialMessages,
  basePath,
  notif,
}: MessageThreadClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const router = useRouter();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || loading) return;
    setLoading(true);
    const result = await sendMessage(conversationId, body);
    setLoading(false);

    if (result.error) {
      show(result.error);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: result.data!.id,
        body: body.trim(),
        sentAt: new Date().toISOString(),
        isMine: true,
        senderName: user.name,
      },
    ]);
    setBody('');
    router.refresh();
  }

  return (
    <DashShell
      nav={nav}
      active={active}
      user={user}
      topTitle={partnerName}
      topSub={shiftTitle}
      notif={notif}
    >
      <div className="content">
        <Link href={basePath} className="link-btn" style={{ marginBottom: 12, display: 'inline-flex' }}>
          ← All messages
        </Link>
        <div className="msg-layout">
          <div className="msg-thread" style={{ gridColumn: '1 / -1' }}>
            <div className="msg-messages">
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No messages yet. Say hello!</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`msg-bubble${m.isMine ? ' mine' : ' theirs'}`}>
                    {!m.isMine && (
                      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.7 }}>
                        {m.senderName}
                      </div>
                    )}
                    {m.body}
                  </div>
                ))
              )}
            </div>
            <form className="msg-compose" onSubmit={handleSend}>
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type a message…"
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !body.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

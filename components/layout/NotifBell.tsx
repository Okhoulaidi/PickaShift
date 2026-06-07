'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@/components/ui/Icon';
import { fetchNotifications, markNotificationRead } from '@/lib/actions/notifications';
import type { NotificationRecord } from '@/lib/queries/notifications';

interface NotifBellProps {
  unreadCount: number;
  allHref: string;
}

export function NotifBell({ unreadCount, allHref }: NotifBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchNotifications();
    setLoading(false);
    if (result.data) {
      setItems(result.data);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (open && !loaded) load();
  }, [open, loaded, load]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  async function handleClick(item: NotificationRecord) {
    await markNotificationRead(item.id);
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n)),
    );
    setOpen(false);
    if (item.link) router.push(item.link);
  }

  const unread = items.filter((n) => !n.read_at).length;
  const dot = unreadCount > 0 || unread > 0;

  return (
    <div className="notif-wrap" ref={panelRef}>
      <button
        type="button"
        className="icon-btn"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="bell" size={20} />
        {dot && <span className="notif-dot" />}
      </button>

      {open && (
        <div className="notif-panel" role="menu">
          <div className="notif-panel-head">
            <span>Notifications</span>
            <Link href={allHref} className="notif-all-link" onClick={() => setOpen(false)}>
              View all
            </Link>
          </div>

          {loading && (
            <div className="notif-empty">Loading…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="notif-empty">
              <Icon name="bell" size={22} style={{ opacity: 0.35, marginBottom: 8 }} />
              <div>You&apos;re all caught up</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>No notifications yet</div>
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul className="notif-list">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`notif-item${item.read_at ? '' : ' unread'}`}
                    onClick={() => handleClick(item)}
                  >
                    <div className="notif-item-title">{item.title}</div>
                    <div className="notif-item-body">{item.body}</div>
                    <div className="notif-item-time">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

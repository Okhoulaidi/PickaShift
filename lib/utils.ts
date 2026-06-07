import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function bizColor(name: string): string {
  const colors = ['#E8401C', '#2B7A55', '#3454D1', '#9333A8', '#0E7C86', '#C9890E', '#1A1A1A', '#B23A48'];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return colors[h % colors.length];
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function formatPay(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}

export function formatPayHour(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}

export function shiftHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 60);
}

export function estimatedTotal(cents: number, start: string, end: string): string {
  const hours = shiftHours(start, end);
  return formatPay(Math.round(cents * hours));
}

export function formatShiftDate(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE d MMM');
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (t: string) => t.slice(0, 5);
  return `${fmt(start)} – ${fmt(end)}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

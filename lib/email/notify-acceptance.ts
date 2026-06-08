import { escapeHtml } from '@/lib/email/utils';
import { SITE } from '@/lib/site';

export async function notifyApplicationAccepted({
  studentEmail,
  studentName,
  shiftTitle,
  businessName,
  dashboardUrl,
}: {
  studentEmail: string;
  studentName: string;
  shiftTitle: string;
  businessName: string;
  dashboardUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? `Pick a Shift <${SITE.emails.hello}>`;

  const html = `
    <p>Hi ${escapeHtml(studentName)},</p>
    <p>Great news — <strong>${escapeHtml(businessName)}</strong> has accepted your application for <strong>"${escapeHtml(shiftTitle)}"</strong>.</p>
    <p>Log in to view your messages and confirm the details.</p>
    <p><a href="${dashboardUrl}" style="background:#CC0000;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:8px">View my applications</a></p>
    <p style="color:#888;font-size:13px;margin-top:24px">Pick a Shift · Madrid</p>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [studentEmail],
      subject: `You've been accepted for "${shiftTitle}"`,
      html,
    }),
  });
}

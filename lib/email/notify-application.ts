import { escapeHtml } from '@/lib/email/utils';
import { SITE } from '@/lib/site';

export async function notifyNewApplication({
  businessEmail,
  businessName,
  studentName,
  shiftTitle,
  applicantsUrl,
}: {
  businessEmail: string;
  businessName: string;
  studentName: string;
  shiftTitle: string;
  applicantsUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? `Pick a Shift <${SITE.emails.hello}>`;

  const html = `
    <p>Hi ${escapeHtml(businessName)},</p>
    <p><strong>${escapeHtml(studentName)}</strong> has applied to your shift <strong>"${escapeHtml(shiftTitle)}"</strong>.</p>
    <p><a href="${applicantsUrl}" style="background:#CC0000;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:8px">View applicants</a></p>
    <p style="color:#888;font-size:13px;margin-top:24px">Pick a Shift · Madrid</p>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [businessEmail],
      subject: `New application for "${shiftTitle}"`,
      html,
    }),
  });
}

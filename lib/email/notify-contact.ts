import { SITE } from '@/lib/site';
import type { ContactFormInput } from '@/lib/actions/contact';
import { escapeHtml } from '@/lib/email/utils';

export async function notifyContactSubmission(input: ContactFormInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[notifyContactSubmission] RESEND_API_KEY not set — skipping email');
    return;
  }

  const to = process.env.CONTACT_NOTIFY_EMAIL ?? SITE.emails.hello;
  const from = process.env.RESEND_FROM_EMAIL ?? `Pick a Shift <${SITE.emails.hello}>`;

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(input.message)}</pre>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `[Contact] ${input.subject}`,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('[notifyContactSubmission] Resend error:', response.status, body);
  }
}

import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope, Sora } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pickashift.org'),
  title: {
    default: 'Pick a Shift — Flexible shifts for students in Madrid',
    template: '%s · Pick a Shift',
  },
  description:
    'Madrid\'s marketplace for student shift work. Students earn on their schedule, businesses staff up in minutes.',
  keywords: ['Madrid', 'student jobs', 'shifts', 'part-time', 'flexible work'],
  openGraph: {
    title: 'Pick a Shift — Flexible shifts for students in Madrid',
    description:
      'Madrid\'s marketplace for student shift work. Students earn on their schedule, businesses staff up in minutes.',
    url: 'https://pickashift.org',
    siteName: 'Pick a Shift',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Pick a Shift' }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pick a Shift — Flexible shifts for students in Madrid',
    description: 'Madrid\'s marketplace for student shift work.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} className={`${manrope.variable} ${sora.variable}`}>
        <body className="font-manrope antialiased">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ToastProvider>{children}</ToastProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

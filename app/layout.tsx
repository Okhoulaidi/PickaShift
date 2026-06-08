import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope, Sora } from 'next/font/google';
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
  metadataBase: new URL('https://pick-a-shift.vercel.app'),
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
    url: 'https://pick-a-shift.vercel.app',
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${manrope.variable} ${sora.variable}`}>
        <body className="font-manrope antialiased">
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

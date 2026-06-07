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
  title: {
    default: 'Pick a Shift — Flexible shifts for students in Madrid',
    template: '%s · Pick a Shift',
  },
  description:
    'Madrid\'s marketplace for student shift work. Students earn on their schedule, businesses staff up in minutes.',
  keywords: ['Madrid', 'student jobs', 'shifts', 'part-time', 'flexible work'],
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

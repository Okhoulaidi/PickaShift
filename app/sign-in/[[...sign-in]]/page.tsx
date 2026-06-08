import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 font-manrope">
      <Link href="/" className="mb-8">
        <Logo className="logo logo-sm" />
      </Link>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}

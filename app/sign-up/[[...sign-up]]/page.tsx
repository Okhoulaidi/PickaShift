import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const validRole = role === 'student' || role === 'business' ? role : null;
  const redirectUrl = validRole ? `/sign-up/role?role=${validRole}` : '/sign-up/role';

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 font-manrope">
      <Link href="/" className="mb-8">
        <Logo className="logo logo-sm" />
      </Link>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}

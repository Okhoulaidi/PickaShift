import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkMetadata } from '@/lib/auth';
import RoleSelectionClient from './RoleSelectionClient';

export default async function RoleSelectionPage() {
  const { sessionClaims } = await auth();
  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);

  // Hard lock: if a role is already set, send to the right dashboard.
  if (meta.role) {
    redirect(
      meta.role === 'business' ? '/biz/dashboard'
      : meta.role === 'admin'  ? '/admin'
      : '/dashboard'
    );
  }

  return <RoleSelectionClient />;
}

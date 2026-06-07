import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { UserRole, UserMetadata } from './constants';
import { createAdminClient } from './supabase/admin';

export function getClerkMetadata(sessionClaims: Record<string, unknown> | null | undefined): UserMetadata {
  const meta = (sessionClaims?.metadata ?? sessionClaims?.public_metadata ?? {}) as UserMetadata;
  return meta;
}

export async function requireActionAuth(allowedRoles?: UserRole[]) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return { error: 'Unauthorized' as const, userId: null as null, meta: null as null };
  const meta = getClerkMetadata(sessionClaims as Record<string, unknown> | null | undefined);
  if (meta.suspended) return { error: 'Account suspended' as const, userId: null as null, meta: null as null };
  if (allowedRoles?.length && (!meta.role || !allowedRoles.includes(meta.role))) {
    return { error: 'Forbidden' as const, userId: null as null, meta: null as null };
  }
  return { error: null as null, userId, meta };
}

export async function getSessionUser() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const meta = user.publicMetadata as UserMetadata;
  return { userId, user, meta };
}

export async function requireAuth() {
  const session = await getSessionUser();
  if (!session) redirect('/sign-in');
  if (session.user.publicMetadata?.suspended) redirect('/suspended');
  return session;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();
  const role = session.meta.role;
  if (!role || !roles.includes(role)) {
    redirect(role === 'business' ? '/biz/dashboard' : role === 'admin' ? '/admin' : '/dashboard');
  }
  return session;
}

export async function getProfile(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}

export async function syncClerkMetadata(userId: string, data: Partial<UserMetadata>) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...user.publicMetadata, ...data },
  });
}

export async function getDashboardPath(role?: UserRole) {
  if (role === 'business') return '/biz/dashboard';
  if (role === 'admin') return '/admin';
  return '/dashboard';
}

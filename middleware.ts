import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { UserMetadata } from '@/lib/constants';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/browse(.*)',
  '/shifts/(.*)',
  '/api/webhooks(.*)',
  '/suspended',
]);

const isOnboardingRoute = createRouteMatcher([
  '/sign-up/role',
  '/onboarding/student',
  '/onboarding/business',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isBusinessRoute = createRouteMatcher(['/biz(.*)']);
const isStudentRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/applications(.*)',
  '/messages(.*)',
  '/profile(.*)',
  '/earnings(.*)',
]);

function dashboardPath(meta: UserMetadata) {
  if (meta.role === 'business') return '/biz/dashboard';
  if (meta.role === 'admin') return '/admin';
  return '/dashboard';
}

function onboardingPath(meta: UserMetadata) {
  if (meta.role === 'business') return '/onboarding/business';
  if (meta.role === 'admin') return '/admin';
  return '/onboarding/student';
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const meta = (sessionClaims?.metadata ?? sessionClaims?.public_metadata ?? {}) as UserMetadata;
  const path = req.nextUrl.pathname;

  if (isPublicRoute(req)) {
    if (userId) {
      if (meta.onboardingComplete === true && (path === '/' || path === '/sign-in')) {
        return NextResponse.redirect(new URL(dashboardPath(meta), req.url));
      }
      if (path === '/sign-in' && meta.role && meta.onboardingComplete !== true) {
        return NextResponse.redirect(new URL(onboardingPath(meta), req.url));
      }
    }
    return NextResponse.next();
  }

  if (!userId) {
    const signIn = new URL('/sign-in', req.url);
    signIn.searchParams.set('redirect_url', path);
    return NextResponse.redirect(signIn);
  }

  if (meta.suspended) {
    return NextResponse.redirect(new URL('/suspended', req.url));
  }

  if (!meta.role && !isOnboardingRoute(req) && path !== '/sign-up/role') {
    return NextResponse.redirect(new URL('/sign-up/role', req.url));
  }

  if (meta.role && meta.onboardingComplete !== true && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL(onboardingPath(meta), req.url));
  }

  // Only block re-selecting role once onboarding is done.
  // Do NOT redirect away from /onboarding/* — DB profile guards handle that
  // (avoids loop when JWT says complete but Supabase row is missing).
  if (meta.onboardingComplete === true && path === '/sign-up/role') {
    return NextResponse.redirect(new URL(dashboardPath(meta), req.url));
  }

  if (isAdminRoute(req) && meta.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isBusinessRoute(req) && meta.role !== 'business' && meta.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isStudentRoute(req) && meta.role === 'business') {
    return NextResponse.redirect(new URL('/biz/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

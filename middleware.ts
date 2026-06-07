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
  '/browse',
  '/applications(.*)',
  '/messages(.*)',
  '/profile(.*)',
  '/earnings(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const meta = (sessionClaims?.metadata ?? sessionClaims?.public_metadata ?? {}) as UserMetadata;
  const path = req.nextUrl.pathname;

  if (isPublicRoute(req)) {
    if (userId && path === '/sign-in') {
      const dest = meta.role === 'business' ? '/biz/dashboard' : meta.role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dest, req.url));
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

  if (meta.role && !meta.onboardingComplete && !isOnboardingRoute(req)) {
    const onboarding = meta.role === 'business' ? '/onboarding/business' : '/onboarding/student';
    return NextResponse.redirect(new URL(onboarding, req.url));
  }

  if (meta.onboardingComplete && isOnboardingRoute(req)) {
    const dest = meta.role === 'business' ? '/biz/dashboard' : meta.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dest, req.url));
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

import type { DashNavItem } from '@/components/layout/DashShell';

type NavT = (key: string) => string;

/** Primary items first (bottom nav shows first 4 + More). */
export function studentNav(t: NavT, pendingApps = 0): DashNavItem[] {
  return [
    { label: t('home'), short: t('homeShort'), icon: 'home', href: '/dashboard' },
    { label: t('browseShifts'), short: t('browseShort'), icon: 'search', href: '/browse' },
    {
      label: t('myApplications'),
      short: t('appliedShort'),
      icon: 'clipboard',
      href: '/dashboard/applications',
      pill: pendingApps || undefined,
    },
    { label: t('messages'), short: t('chatShort'), icon: 'chat', href: '/dashboard/messages' },
    { label: t('myProfile'), short: t('profileShort'), icon: 'user', href: '/dashboard/profile' },
    { label: t('myCv'), short: t('cvShort'), icon: 'upload', href: '/dashboard/cv' },
    { label: t('earnings'), short: t('earnShort'), icon: 'euro', href: '/dashboard/earnings' },
    { label: t('myReviews'), short: t('reviewsShort'), icon: 'star', href: '/dashboard/reviews' },
  ];
}

export function businessNav(t: NavT, openShifts = 0, pendingReview = 0): DashNavItem[] {
  return [
    { label: t('overview'), short: t('homeShort'), icon: 'home', href: '/biz/dashboard' },
    { label: t('postShift'), short: t('postShort'), icon: 'plus', href: '/biz/shifts/new' },
    {
      label: t('manageShifts'),
      short: t('shiftsShort'),
      icon: 'briefcase',
      href: '/biz/shifts',
      pill: openShifts || undefined,
    },
    {
      label: t('applicants'),
      short: t('applyShort'),
      icon: 'clipboard',
      href: '/biz/applicants',
      pill: pendingReview || undefined,
    },
    { label: t('workerPool'), short: t('poolShort'), icon: 'users', href: '/biz/talent-pool' },
    { label: t('messages'), short: t('chatShort'), icon: 'chat', href: '/biz/messages' },
    { label: t('analytics'), short: t('statsShort'), icon: 'chart', href: '/biz/analytics' },
    { label: t('reviews'), short: t('reviewsShort'), icon: 'star', href: '/biz/reviews' },
    { label: t('companyProfile'), short: t('profileShort'), icon: 'user', href: '/biz/profile' },
  ];
}

export function adminNav(t: NavT, contactCount = 0): DashNavItem[] {
  return [
    { label: t('overview'), short: t('homeShort'), icon: 'home', href: '/admin' },
    {
      label: t('businesses'),
      short: t('bizShort'),
      icon: 'briefcase',
      href: '/admin/businesses',
    },
    { label: t('users'), short: t('usersShort'), icon: 'users', href: '/admin/users' },
    {
      label: t('contact'),
      short: t('inboxShort'),
      icon: 'mail',
      href: '/admin/contact',
      pill: contactCount || undefined,
    },
  ];
}

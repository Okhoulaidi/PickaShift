import type { DashNavItem } from '@/components/layout/DashShell';

/** Primary items first (bottom nav shows first 4 + More). */
export function studentNav(pendingApps = 0): DashNavItem[] {
  return [
    { label: 'Home', short: 'Home', icon: 'home', href: '/dashboard' },
    { label: 'Browse Shifts', short: 'Browse', icon: 'search', href: '/browse' },
    {
      label: 'My Applications',
      short: 'Applied',
      icon: 'clipboard',
      href: '/dashboard/applications',
      pill: pendingApps || undefined,
    },
    { label: 'Messages', short: 'Chat', icon: 'chat', href: '/dashboard/messages' },
    { label: 'My Profile', short: 'Profile', icon: 'user', href: '/dashboard/profile' },
    { label: 'My CV', short: 'CV', icon: 'upload', href: '/dashboard/cv' },
    { label: 'Earnings', short: 'Earn', icon: 'euro', href: '/dashboard/earnings' },
    { label: 'My Reviews', short: 'Reviews', icon: 'star', href: '/dashboard/reviews' },
  ];
}

export function businessNav(openShifts = 0, pendingReview = 0): DashNavItem[] {
  return [
    { label: 'Overview', short: 'Home', icon: 'home', href: '/biz/dashboard' },
    { label: 'Post a Shift', short: 'Post', icon: 'plus', href: '/biz/shifts/new' },
    {
      label: 'Manage Shifts',
      short: 'Shifts',
      icon: 'briefcase',
      href: '/biz/shifts',
      pill: openShifts || undefined,
    },
    {
      label: 'Applicants',
      short: 'Apply',
      icon: 'clipboard',
      href: '/biz/applicants',
      pill: pendingReview || undefined,
    },
    { label: 'Worker Pool', short: 'Pool', icon: 'users', href: '/biz/talent-pool' },
    { label: 'Messages', short: 'Chat', icon: 'chat', href: '/biz/messages' },
    { label: 'Analytics', short: 'Stats', icon: 'chart', href: '/biz/analytics' },
    { label: 'Reviews', short: 'Reviews', icon: 'star', href: '/biz/reviews' },
    { label: 'Company Profile', short: 'Profile', icon: 'user', href: '/biz/profile' },
  ];
}

export function adminNav(contactCount = 0): DashNavItem[] {
  return [
    { label: 'Overview', short: 'Home', icon: 'home', href: '/admin' },
    {
      label: 'Businesses',
      short: 'Biz',
      icon: 'briefcase',
      href: '/admin/businesses',
    },
    { label: 'Users', short: 'Users', icon: 'users', href: '/admin/users' },
    {
      label: 'Contact',
      short: 'Inbox',
      icon: 'mail',
      href: '/admin/contact',
      pill: contactCount || undefined,
    },
  ];
}

import type { DashNavItem } from '@/components/layout/DashShell';

export function studentNav(pendingApps = 0): DashNavItem[] {
  return [
    { label: 'Home', short: 'Home', icon: 'home', href: '/dashboard' },
    { label: 'Browse Shifts', short: 'Browse', icon: 'search', href: '/browse' },
    { label: 'My Applications', short: 'Applied', icon: 'clipboard', href: '/dashboard/applications', pill: pendingApps || undefined },
    { label: 'Messages', short: 'Chat', icon: 'file', href: '/dashboard/messages' },
    { label: 'Earnings', short: 'Earn', icon: 'euro', href: '/dashboard/earnings' },
    { label: 'My Profile', short: 'Profile', icon: 'user', href: '/dashboard/profile' },
  ];
}

export function businessNav(openShifts = 0, pendingReview = 0): DashNavItem[] {
  return [
    { label: 'Overview', short: 'Home', icon: 'home', href: '/biz/dashboard' },
    { label: 'Post a Shift', short: 'Post', icon: 'plus', href: '/biz/shifts/new' },
    { label: 'Manage Shifts', short: 'Shifts', icon: 'briefcase', href: '/biz/shifts', pill: openShifts || undefined },
    { label: 'Worker Pool', short: 'Workers', icon: 'users', href: '/biz/talent-pool' },
    { label: 'Messages', short: 'Chat', icon: 'file', href: '/biz/messages' },
    { label: 'Analytics', short: 'Stats', icon: 'chart', href: '/biz/analytics' },
    { label: 'Profile', short: 'Profile', icon: 'user', href: '/biz/profile' },
  ];
}

export function adminNav(pendingVerifications = 0): DashNavItem[] {
  return [
    { label: 'Overview', short: 'Home', icon: 'home', href: '/admin' },
    { label: 'Businesses', short: 'Biz', icon: 'briefcase', href: '/admin/businesses', pill: pendingVerifications || undefined },
    { label: 'Users', short: 'Users', icon: 'users', href: '/admin/users' },
  ];
}

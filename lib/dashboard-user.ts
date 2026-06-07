import { bizColor, initials } from '@/lib/utils';
import type { DashUser } from '@/components/layout/DashShell';

export function studentDashUser(
  profile: { first_name: string | null; last_name: string | null },
  student: { university: string | null; degree: string | null } | null,
): DashUser {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Student';
  const uni = student?.university?.replace(/\s*\([^)]*\)\s*/g, '').trim() ?? '';
  const degree = student?.degree ?? '';
  const sub = [uni, degree].filter(Boolean).join(' · ') || 'Student worker';

  return {
    name,
    sub,
    initials: initials(name),
    color: bizColor(name),
  };
}

export function businessDashUser(
  business: { business_name: string; business_type: string; district: string },
): DashUser {
  const name = business.business_name;
  return {
    name,
    sub: `${business.business_type} · ${business.district}`,
    initials: initials(name),
    color: bizColor(name),
  };
}

export function adminDashUser(
  profile: { first_name: string | null; last_name: string | null; email: string },
): DashUser {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin';
  return {
    name,
    sub: profile.email,
    initials: initials(name),
    color: '#1A1A1A',
  };
}

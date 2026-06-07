'use server';

import { currentUser } from '@clerk/nextjs/server';
import { requireActionAuth, syncClerkMetadata } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { UserRole } from '@/lib/constants';
import type { ActionResult } from '@/lib/types';

export interface StudentOnboardingInput {
  university: string;
  degree: string;
  yearOfStudy: number;
  bio?: string;
  skills: string[];
  languages?: Record<string, string>;
  availability?: Record<string, string[]>;
  district: string;
  cvUrl?: string;
}

export interface BusinessOnboardingInput {
  businessName: string;
  businessType: string;
  nif?: string;
  district: string;
  address?: string;
  phone?: string;
  publicEmail?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
}

export async function setUserRole(role: 'student' | 'business'): Promise<ActionResult> {
  const session = await requireActionAuth();
  if (session.error) return { error: session.error };

  // Hard lock: once a role is set it cannot be changed via this action.
  if (session.meta?.role) {
    return { error: 'Your account type is already set and cannot be changed.' };
  }

  const supabase = createAdminClient();
  const user = await currentUser();
  if (!user) return { error: 'User not found' };

  const email = user.emailAddresses[0]?.emailAddress ?? '';
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: session.userId,
    role,
    email,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar_url: user.imageUrl,
    onboarding_complete: false,
  });

  if (profileError) return { error: profileError.message };

  await syncClerkMetadata(session.userId, { role, onboardingComplete: false });
  return { success: true };
}

export async function completeStudentOnboarding(input: StudentOnboardingInput): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const user = await currentUser();
  if (!user) return { error: 'User not found' };

  const { error: studentError } = await supabase.from('students').upsert({
    id: session.userId,
    university: input.university,
    degree: input.degree,
    year_of_study: input.yearOfStudy,
    bio: input.bio ?? null,
    skills: input.skills,
    languages: input.languages ?? { es: 'native' },
    availability: input.availability ?? {},
    district: input.district,
    cv_url: input.cvUrl ?? null,
  });

  if (studentError) return { error: studentError.message };

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: user.firstName,
      last_name: user.lastName,
      avatar_url: user.imageUrl,
      onboarding_complete: true,
    })
    .eq('id', session.userId);

  if (profileError) return { error: profileError.message };

  await syncClerkMetadata(session.userId, { role: 'student' as UserRole, onboardingComplete: true });
  return { success: true };
}

export async function completeBusinessOnboarding(input: BusinessOnboardingInput): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const user = await currentUser();
  if (!user) return { error: 'User not found' };

  const { error: businessError } = await supabase.from('businesses').upsert({
    id: session.userId,
    business_name: input.businessName,
    business_type: input.businessType,
    nif: input.nif ?? null,
    district: input.district,
    address: input.address ?? null,
    phone: input.phone ?? null,
    public_email: input.publicEmail ?? user.emailAddresses[0]?.emailAddress ?? null,
    website: input.website ?? null,
    description: input.description ?? null,
    logo_url: input.logoUrl ?? null,
    verified: true,
    verified_at: new Date().toISOString(),
  });

  if (businessError) return { error: businessError.message };

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: user.firstName,
      last_name: user.lastName,
      avatar_url: user.imageUrl,
      onboarding_complete: true,
    })
    .eq('id', session.userId);

  if (profileError) return { error: profileError.message };

  await syncClerkMetadata(session.userId, { role: 'business' as UserRole, onboardingComplete: true, verified: true });
  return { success: true };
}

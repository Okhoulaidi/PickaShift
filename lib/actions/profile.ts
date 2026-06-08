'use server';

import { requireActionAuth } from '@/lib/auth';
import { STUDENT_CV_BUCKET } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';
import { cvStoragePath, ensureStudentCvBucket } from '@/lib/storage/cv';
import type { ActionResult } from '@/lib/types';

export interface StudentProfileInput {
  firstName?: string;
  lastName?: string;
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

export interface BusinessProfileInput {
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

export async function updateStudentProfile(input: StudentProfileInput): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();

  // Update name in profiles table if provided
  if (input.firstName !== undefined || input.lastName !== undefined) {
    const nameUpdate: Record<string, string | null> = {};
    if (input.firstName !== undefined) nameUpdate.first_name = input.firstName.trim() || null;
    if (input.lastName !== undefined) nameUpdate.last_name = input.lastName.trim() || null;
    await supabase.from('profiles').update(nameUpdate).eq('id', session.userId);
  }

  const { error } = await supabase
    .from('students')
    .update({
      university: input.university,
      degree: input.degree,
      year_of_study: input.yearOfStudy,
      bio: input.bio ?? null,
      skills: input.skills,
      languages: input.languages ?? { es: 'native' },
      availability: input.availability ?? {},
      district: input.district,
      cv_url: input.cvUrl ?? null,
    })
    .eq('id', session.userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateBusinessProfile(input: BusinessProfileInput): Promise<ActionResult> {
  const session = await requireActionAuth(['business']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('businesses')
    .update({
      business_name: input.businessName,
      business_type: input.businessType,
      nif: input.nif ?? null,
      district: input.district,
      address: input.address ?? null,
      phone: input.phone ?? null,
      public_email: input.publicEmail ?? null,
      website: input.website ?? null,
      description: input.description ?? null,
      logo_url: input.logoUrl ?? null,
    })
    .eq('id', session.userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getSignedCvUploadUrl(): Promise<ActionResult<{ signedUrl: string; path: string }>> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  try {
    await ensureStudentCvBucket();
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not access CV storage.' };
  }

  const supabase = createAdminClient();
  const path = cvStoragePath(session.userId);

  const { data, error } = await supabase.storage
    .from(STUDENT_CV_BUCKET)
    .createSignedUploadUrl(path);

  if (error) return { error: error.message };
  return { success: true, data: { signedUrl: data.signedUrl, path } };
}

export async function getSignedCvDownloadUrl(): Promise<ActionResult<{ url: string }>> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const path = cvStoragePath(session.userId);

  const { data, error } = await supabase.storage
    .from(STUDENT_CV_BUCKET)
    .createSignedUrl(path, 3600);

  if (error) return { error: error.message };
  return { success: true, data: { url: data.signedUrl } };
}

export async function saveCvUrl(path: string): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const expected = cvStoragePath(session.userId);
  if (path !== expected) return { error: 'Invalid CV path.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('students')
    .update({ cv_url: path })
    .eq('id', session.userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCv(): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const path = cvStoragePath(session.userId);

  const { error: storageError } = await supabase.storage
    .from(STUDENT_CV_BUCKET)
    .remove([path]);

  if (storageError) return { error: storageError.message };

  const { error: dbError } = await supabase
    .from('students')
    .update({ cv_url: null })
    .eq('id', session.userId);

  if (dbError) return { error: dbError.message };
  return { success: true };
}

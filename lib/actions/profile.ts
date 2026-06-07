'use server';

import { requireActionAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult } from '@/lib/types';

export interface StudentProfileInput {
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

  const supabase = createAdminClient();
  const path = `cvs/${session.userId}.pdf`;

  const { data, error } = await supabase.storage
    .from('student-cvs')
    .createSignedUploadUrl(path);

  if (error) return { error: error.message };
  return { success: true, data: { signedUrl: data.signedUrl, path } };
}

export async function saveCvUrl(path: string): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();

  const { data: urlData } = supabase.storage
    .from('student-cvs')
    .getPublicUrl(path);

  const { error } = await supabase
    .from('students')
    .update({ cv_url: urlData.publicUrl })
    .eq('id', session.userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCv(): Promise<ActionResult> {
  const session = await requireActionAuth(['student']);
  if (session.error) return { error: session.error };

  const supabase = createAdminClient();
  const path = `cvs/${session.userId}.pdf`;

  const { error: storageError } = await supabase.storage
    .from('student-cvs')
    .remove([path]);

  if (storageError) return { error: storageError.message };

  const { error: dbError } = await supabase
    .from('students')
    .update({ cv_url: null })
    .eq('id', session.userId);

  if (dbError) return { error: dbError.message };
  return { success: true };
}

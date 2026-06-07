import { STUDENT_CV_BUCKET } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';

export function cvStoragePath(userId: string): string {
  return `cvs/${userId}.pdf`;
}

/** Resolve cv_url from DB to a downloadable URL (handles legacy public URLs). */
export async function resolveCvDownloadUrl(
  cvUrl: string | null | undefined,
  userId: string,
): Promise<string | null> {
  if (!cvUrl) return null;
  if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
    return cvUrl;
  }

  const path = cvUrl.startsWith('cvs/') ? cvUrl : cvStoragePath(userId);
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(STUDENT_CV_BUCKET)
    .createSignedUrl(path, 3600);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function ensureStudentCvBucket(): Promise<void> {
  const supabase = createAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(listError.message);

  const exists = buckets?.some(
    (b) => b.id === STUDENT_CV_BUCKET || b.name === STUDENT_CV_BUCKET,
  );
  if (exists) return;

  const { error } = await supabase.storage.createBucket(STUDENT_CV_BUCKET, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf'],
  });

  if (error && !error.message.toLowerCase().includes('already exists')) {
    throw new Error(error.message);
  }
}

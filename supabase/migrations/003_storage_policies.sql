-- Drop the insecure public policies on student-cvs bucket
DROP POLICY IF EXISTS "Cvs 12x1426_0" ON storage.objects;
DROP POLICY IF EXISTS "Cvs 12x1426_1" ON storage.objects;

-- Students can upload only their own CV (cvs/{their_user_id}.pdf)
CREATE POLICY "Students can upload own CV"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-cvs'
  AND name = 'cvs/' || auth.uid() || '.pdf'
);

-- Students can update/replace their own CV
CREATE POLICY "Students can update own CV"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'student-cvs'
  AND name = 'cvs/' || auth.uid() || '.pdf'
);

-- Students can delete their own CV
CREATE POLICY "Students can delete own CV"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-cvs'
  AND name = 'cvs/' || auth.uid() || '.pdf'
);

-- Any authenticated user (including businesses) can read CVs
CREATE POLICY "Authenticated users can read CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'student-cvs');

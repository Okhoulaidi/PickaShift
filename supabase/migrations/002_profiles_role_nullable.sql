-- Allow role to be null until user completes role selection
ALTER TABLE profiles
  ALTER COLUMN role DROP NOT NULL;

ALTER TABLE profiles
  ALTER COLUMN role DROP DEFAULT;

-- Set any existing 'student' defaults that were set by the webhook
-- before role selection to NULL only if onboarding_complete is false
UPDATE profiles
SET role = NULL
WHERE onboarding_complete = FALSE
  AND role = 'student';

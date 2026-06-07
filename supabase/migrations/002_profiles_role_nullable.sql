-- Allow profiles.role to stay unset until setUserRole() runs after sign-up.
ALTER TABLE profiles ALTER COLUMN role DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS job_types   TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS visa_type   TEXT;

-- availability is changing from day×slot JSONB to a simple text[] of
-- ['mornings','afternoons','evenings','weekends']. Wipe old demo data.
ALTER TABLE students
  ALTER COLUMN availability TYPE TEXT[] USING '{}';
ALTER TABLE students
  ALTER COLUMN availability SET DEFAULT '{}';

-- languages is changing from {"es":"native"} JSONB to a simple text[]
-- e.g. ['Spanish','English']. Wipe old demo data.
ALTER TABLE students
  ALTER COLUMN languages TYPE TEXT[] USING '{}';
ALTER TABLE students
  ALTER COLUMN languages SET DEFAULT '{}';

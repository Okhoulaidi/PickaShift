-- Pick a Shift — initial schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('student', 'business', 'admin');
CREATE TYPE shift_status AS ENUM ('open', 'filled', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'no_show');

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'student',
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
  id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  university TEXT,
  degree TEXT,
  year_of_study INT CHECK (year_of_study BETWEEN 1 AND 6),
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  languages JSONB NOT NULL DEFAULT '{"es":"native"}'::jsonb,
  availability JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_url TEXT,
  reliability_score NUMERIC(4,2) NOT NULL DEFAULT 5.00,
  shifts_completed INT NOT NULL DEFAULT 0,
  total_earned_cents INT NOT NULL DEFAULT 0,
  stripe_account_id TEXT,
  district TEXT
);

CREATE TABLE businesses (
  id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  nif TEXT,
  district TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  public_email TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by TEXT REFERENCES profiles(id),
  stripe_customer_id TEXT,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  shifts_posted INT NOT NULL DEFAULT 0
);

CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  pay_per_hour_cents INT NOT NULL CHECK (pay_per_hour_cents >= 926),
  workers_needed INT NOT NULL DEFAULT 1 CHECK (workers_needed BETWEEN 1 AND 10),
  workers_confirmed INT NOT NULL DEFAULT 0,
  skills_needed TEXT[] NOT NULL DEFAULT '{}',
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  status shift_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  UNIQUE (shift_id, student_id)
);

CREATE TABLE talent_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT,
  UNIQUE (business_id, student_id)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shift_id, student_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  rater_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shift_id, rater_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shifts_status_date ON shifts(status, shift_date);
CREATE INDEX idx_shifts_district ON shifts(district);
CREATE INDEX idx_shifts_business ON shifts(business_id);
CREATE INDEX idx_applications_student ON applications(student_id, status);
CREATE INDEX idx_applications_shift ON applications(shift_id, status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION update_shift_workers_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
    UPDATE shifts SET workers_confirmed = workers_confirmed + 1 WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'filled'
      WHERE id = NEW.shift_id
        AND workers_confirmed >= workers_needed
        AND status = 'open';
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
    UPDATE shifts SET workers_confirmed = workers_confirmed + 1 WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'filled'
      WHERE id = NEW.shift_id
        AND workers_confirmed >= workers_needed
        AND status = 'open';
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
    UPDATE shifts SET workers_confirmed = GREATEST(0, workers_confirmed - 1) WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'open'
      WHERE id = NEW.shift_id AND status = 'filled';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_workers_count
  AFTER INSERT OR UPDATE OF status ON applications
  FOR EACH ROW EXECUTE FUNCTION update_shift_workers_confirmed();

CREATE OR REPLACE FUNCTION recompute_student_reliability()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
  student UUID;
BEGIN
  IF NEW.rated_id IN (SELECT id FROM students) THEN
    student := NEW.rated_id;
    SELECT COALESCE(AVG(score), 5) INTO avg_rating
      FROM ratings WHERE rated_id = student;
    UPDATE students SET reliability_score = ROUND(avg_rating::numeric, 2) WHERE id = student;
  END IF;
  IF NEW.rated_id IN (SELECT id FROM businesses) THEN
    SELECT COALESCE(AVG(score), 0) INTO avg_rating
      FROM ratings WHERE rated_id = NEW.rated_id;
    UPDATE businesses SET rating_avg = ROUND(avg_rating::numeric, 2) WHERE id = NEW.rated_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ratings_recompute
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION recompute_student_reliability();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon + authenticated)
CREATE POLICY profiles_read_own ON profiles FOR SELECT USING (true);
CREATE POLICY businesses_public_read ON businesses FOR SELECT USING (verified = true OR true);
CREATE POLICY shifts_public_read ON shifts FOR SELECT USING (
  status IN ('open', 'filled', 'completed')
  AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = shifts.business_id AND b.verified = true)
);
CREATE POLICY students_read ON students FOR SELECT USING (true);
CREATE POLICY applications_read ON applications FOR SELECT USING (true);
CREATE POLICY ratings_read ON ratings FOR SELECT USING (true);
CREATE POLICY conversations_read ON conversations FOR SELECT USING (true);
CREATE POLICY messages_read ON messages FOR SELECT USING (true);
CREATE POLICY notifications_read ON notifications FOR SELECT USING (true);
CREATE POLICY talent_pool_read ON talent_pool FOR SELECT USING (true);

-- Service role bypasses RLS; app uses server-side admin client with Clerk auth checks

-- Migration 005: Fix shift completion trigger
--
-- Bug: The trigger fired on accepted → completed, decrementing workers_confirmed
-- and reopening filled shifts. This corrupted state for multi-worker shifts.
--
-- Fix: Exclude 'completed' from the decrement branch. Completing a worker should
-- not affect workers_confirmed — completeApplication() already handles shift
-- completion by checking remaining accepted applications.

CREATE OR REPLACE FUNCTION update_shift_workers_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Application created as accepted
  IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
    UPDATE shifts SET workers_confirmed = workers_confirmed + 1 WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'filled'
      WHERE id = NEW.shift_id
        AND workers_confirmed >= workers_needed
        AND status = 'open';

  -- Application transitioned into accepted (e.g. pending → accepted)
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
    UPDATE shifts SET workers_confirmed = workers_confirmed + 1 WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'filled'
      WHERE id = NEW.shift_id
        AND workers_confirmed >= workers_needed
        AND status = 'open';

  -- Worker removed from active roster: rejected / withdrawn / cancelled / no_show
  -- NOTE: 'completed' is intentionally excluded — shift completion is handled by
  -- completeApplication() which sets shift.status = 'completed' once no accepted
  -- applications remain. Decrementing here would incorrectly reopen filled shifts.
  ELSIF TG_OP = 'UPDATE'
    AND OLD.status = 'accepted'
    AND NEW.status NOT IN ('accepted', 'completed') THEN
    UPDATE shifts SET workers_confirmed = GREATEST(0, workers_confirmed - 1) WHERE id = NEW.shift_id;
    UPDATE shifts SET status = 'open'
      WHERE id = NEW.shift_id AND status = 'filled';

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

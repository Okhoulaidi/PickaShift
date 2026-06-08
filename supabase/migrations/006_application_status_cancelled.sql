-- Migration 006: allow cancelled application status (shift cancelled by business)

ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'cancelled';

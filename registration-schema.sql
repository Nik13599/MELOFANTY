-- MELOFANTY: run in separate Cloudflare D1 database "melofanty-registration".
-- Store names and phone numbers only in D1. Never put registrations in public JS.
CREATE TABLE IF NOT EXISTS events (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 starts_at TEXT NOT NULL,
 ends_at TEXT NOT NULL,
 venue TEXT NOT NULL DEFAULT '',
 description TEXT NOT NULL DEFAULT '',
 poster TEXT NOT NULL DEFAULT '',
 admin_poster TEXT NOT NULL DEFAULT '',
 capacity INTEGER,
 next_seq INTEGER NOT NULL DEFAULT 0,
 archived INTEGER NOT NULL DEFAULT 0,
 is_demo INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(starts_at);
CREATE TABLE IF NOT EXISTS registrations (
 event_id TEXT NOT NULL REFERENCES events(id),
 seq INTEGER NOT NULL,
 code TEXT NOT NULL,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 party_size INTEGER NOT NULL CHECK (party_size BETWEEN 1 AND 50),
 status TEXT NOT NULL CHECK (status IN ('pending','confirmed','cancelled','deleted')),
 source TEXT NOT NULL DEFAULT 'site',
 guest_comment TEXT NOT NULL DEFAULT '',
 admin_comment TEXT NOT NULL DEFAULT '',
 table_number TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(event_id,seq)
);
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(event_id,status,created_at);
CREATE TABLE IF NOT EXISTS admin_attempts (ip_hash TEXT NOT NULL, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_attempts ON admin_attempts(ip_hash,at);

-- Migration for databases created before comments were introduced:
-- ALTER TABLE registrations ADD COLUMN guest_comment TEXT NOT NULL DEFAULT '';
-- ALTER TABLE registrations ADD COLUMN admin_comment TEXT NOT NULL DEFAULT '';
-- ALTER TABLE events ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0;

-- Existing D1 instances: run only if the column is absent.
-- ALTER TABLE events ADD COLUMN admin_poster TEXT NOT NULL DEFAULT '';
-- This migration has already been applied to the existing MELOFANTY D1 database.

-- Existing D1 instances: execute once before deploying the updated Worker:
-- ALTER TABLE registrations ADD COLUMN table_number TEXT NOT NULL DEFAULT '';

-- CRM profiles are optional overlays on registration-derived clients.
-- See crm-migration.sql for the safe migration of an already existing D1 database.
CREATE TABLE IF NOT EXISTS client_profiles (
  phone_key TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  wishes TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  linked_user_id TEXT UNIQUE DEFAULT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- linked_user_id is reserved for future opt-in guest accounts; no accounts are created now.

-- CRM for MELOFANTY. Safe to apply before deploying Worker code.
-- Each client is identified by a normalized phone number derived from registration records.
-- Historic registration names are preserved; an admin name override never changes them.
-- Demo registrations are excluded in the API.
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

-- Single-user, local-first todo application schema.
--
-- Design notes:
-- * There is one table, `tasks`. There are no user accounts, so no `users`
--   table is needed.
-- * `status` is constrained by CHECK to the three fixed statuses. It is not
--   a foreign key to a lookup table because the brief states statuses are
--   fixed and not user customisable.
-- * `archived_at` is a nullable timestamp rather than a boolean flag. This
--   both marks whether a task is archived (NULL = active) and records when
--   the archive happened, and it means archiving is an UPDATE, never a
--   DELETE or a copy to another table -- tasks are never deleted.
-- * There is no `is_overdue` or `overdue` column. Overdue is a derived
--   property (due_date is in the past AND status != 'Complete') and is
--   computed at read time in lib/overdue.ts, so it can never drift out of
--   sync with the due date or status.

CREATE TABLE IF NOT EXISTS tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL CHECK (length(trim(title)) > 0),
  description   TEXT    NOT NULL DEFAULT '',
  due_date      TEXT    NOT NULL, -- ISO 8601 date string, e.g. '2026-08-04'
  topic         TEXT    NOT NULL CHECK (length(trim(topic)) > 0),
  status        TEXT    NOT NULL CHECK (status IN ('Todo', 'In-Progress', 'Complete')) DEFAULT 'Todo',
  archived_at   TEXT    DEFAULT NULL, -- NULL = active, ISO timestamp = archived
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_archived_at ON tasks (archived_at);
CREATE INDEX IF NOT EXISTS idx_tasks_topic ON tasks (topic);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);

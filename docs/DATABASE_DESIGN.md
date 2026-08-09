# Database Design

## Engine

SQLite, accessed through Node's built-in `node:sqlite` module (no third-party driver — see
`THIRD_PARTY_CODE.md`). The database file lives at `database/todo.db` and is created automatically
(from `database/schema.sql`) the first time it's needed — either by `npm run init-db` or by the
app itself on first request.

## Tables

There is a single table, `tasks`. The application has no user accounts (it's explicitly
single-user, local-first), so there is no `users` table, and consequently no foreign keys or
relationships between tables — `tasks` is self-contained.

```sql
CREATE TABLE tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL CHECK (length(trim(title)) > 0),
  description   TEXT    NOT NULL DEFAULT '',
  due_date      TEXT    NOT NULL,                 -- ISO 8601 date, e.g. '2026-08-04'
  topic         TEXT    NOT NULL CHECK (length(trim(topic)) > 0),
  status        TEXT    NOT NULL CHECK (status IN ('Todo', 'In-Progress', 'Complete')) DEFAULT 'Todo',
  archived_at   TEXT    DEFAULT NULL,              -- NULL = active, timestamp = archived
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
```

Indexes exist on `archived_at`, `topic`, `status`, and `due_date` since every one of those columns
is used to filter or sort the task list.

## Column-level design decisions

**`status`** is constrained with a `CHECK` to exactly the three fixed values the brief specifies
(`Todo`, `In-Progress`, `Complete`), rather than a separate lookup table with a foreign key. The
brief states these statuses are fixed and not user-customisable, so a lookup table would only add
indirection without adding flexibility that's actually needed.

**`archived_at`** is a nullable timestamp, not a boolean `archived` flag and not a separate
`archived_tasks` table. Two reasons:
- A task must never be deleted, only archived, and must remain viewable — storing it in the same
  row, in the same table, guarantees that: there is no code path that copies or deletes it.
- Making it a timestamp rather than a boolean records *when* a task was archived for free, and
  archiving becomes a single `UPDATE ... SET archived_at = ... WHERE archived_at IS NULL`, which is
  naturally idempotent (`lib/taskRepository.ts`, `archiveTask`).

**There is no `overdue` or `is_overdue` column.** Overdue is a derived property — a task is
overdue when its due date is in the past and its status is not `Complete` — and is computed at
read time in `lib/overdue.ts`. Storing it as a column would mean it could go stale (e.g. a task
that was up to date yesterday becomes overdue today with no write happening to update the row).
Computing it on read means it is always correct and can never drift out of sync with `due_date`
and `status`. This also satisfies the brief's requirement that overdue is indicated *without*
being one of the three selectable statuses — it isn't a status at all, so there's no fourth value
to accidentally select.

**`created_at` / `updated_at`** are plain audit timestamps, defaulted and maintained by the
application layer (`updated_at` is bumped on every `UPDATE`), not required by the brief but useful
for debugging and for the "edited task survives reload" walkthrough step.

## Access layer

All SQL lives in `lib/taskRepository.ts` — nothing else in the codebase writes raw SQL. This keeps
the schema-to-code mapping in one place and is what the tests in `tests/repository.test.ts` and
`tests/archive.test.ts` exercise directly.

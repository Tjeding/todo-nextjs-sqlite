import { getDb } from "./db";
import { SortField, Status } from "./constants";

// node:sqlite returns rows as objects with a null prototype; TaskRow below
// describes their shape for our own type-checking purposes.

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: Status;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskRow {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topic: row.topic,
    status: row.status as Status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate: string;
  topic: string;
  status?: Status;
}

export function createTask(input: CreateTaskInput): Task {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO tasks (title, description, due_date, topic, status)
     VALUES (@title, @description, @dueDate, @topic, @status)`
  );
  const result = stmt.run({
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    dueDate: input.dueDate,
    topic: input.topic.trim(),
    status: input.status ?? "Todo",
  });
  return getTaskById(Number(result.lastInsertRowid))!;
}

export function getTaskById(id: number): Task | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as unknown as TaskRow | undefined;
  return row ? rowToTask(row) : undefined;
}

export interface UpdateTaskInput {
  title: string;
  description?: string;
  dueDate: string;
  topic: string;
  status: Status;
}

export function updateTask(id: number, input: UpdateTaskInput): Task | undefined {
  const db = getDb();
  const stmt = db.prepare(
    `UPDATE tasks
     SET title = @title,
         description = @description,
         due_date = @dueDate,
         topic = @topic,
         status = @status,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = @id`
  );
  const result = stmt.run({
    id,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    dueDate: input.dueDate,
    topic: input.topic.trim(),
    status: input.status,
  });
  if (result.changes === 0) return undefined;
  return getTaskById(id);
}

/** Archiving sets archived_at; it never deletes or copies the row. Idempotent. */
export function archiveTask(id: number): Task | undefined {
  const db = getDb();
  const stmt = db.prepare(
    `UPDATE tasks
     SET archived_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ? AND archived_at IS NULL`
  );
  stmt.run(id);
  return getTaskById(id);
}

const SORT_COLUMNS: Record<SortField, string> = {
  topic: "topic COLLATE NOCASE ASC, due_date ASC",
  // Logical lifecycle order, not alphabetical.
  status: "CASE status WHEN 'Todo' THEN 0 WHEN 'In-Progress' THEN 1 WHEN 'Complete' THEN 2 END ASC, due_date ASC",
  dueDate: "due_date ASC, topic COLLATE NOCASE ASC",
};

export interface ListTasksOptions {
  archived?: boolean;
  sortBy?: SortField;
}

export function listTasks(options: ListTasksOptions = {}): Task[] {
  const db = getDb();
  const archived = options.archived ?? false;
  const orderBy = SORT_COLUMNS[options.sortBy ?? "dueDate"];

  const rows = db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived_at IS ${archived ? "NOT NULL" : "NULL"}
       ORDER BY ${orderBy}`
    )
    .all() as unknown as TaskRow[];

  return rows.map(rowToTask);
}

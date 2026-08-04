import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let db: DatabaseSync | null = null;

/**
 * Path to the SQLite file. Overridable via TODO_DB_PATH so tests can point
 * at a throwaway database instead of the developer's real data.
 */
function resolveDbPath(): string {
  return process.env.TODO_DB_PATH ?? path.join(process.cwd(), "database", "todo.db");
}

export function getDb(): DatabaseSync {
  if (db) return db;

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");

  const schemaPath = path.join(process.cwd(), "database", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);

  return db;
}

/** Used by tests to force a fresh connection against a new TODO_DB_PATH. */
export function resetDbConnection(): void {
  if (db) {
    db.close();
    db = null;
  }
}

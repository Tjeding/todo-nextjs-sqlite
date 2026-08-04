import path from "node:path";

// Every test run uses tests/test.db, never database/todo.db. The script
// `npm test` runs (scripts/reset-test-db.js) deletes this file first, so
// each run starts from a clean, throwaway database.
process.env.TODO_DB_PATH = path.join(process.cwd(), "tests", "test.db");

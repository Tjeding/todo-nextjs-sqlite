# Running It

## Node version

Node **22.5.0 or later** (tested on 22.22.2). This is required because the app uses the built-in
`node:sqlite` module, which was added in Node 22.5.0.

Check your version with:

```bash
node --version
```

## Install

From a clean clone, in the repository root:

```bash
npm install
```

## Set up the database

Creates `database/todo.db` from `database/schema.sql`. Safe to re-run — it will not overwrite
existing data.

```bash
npm run init-db
```

## Run it

Development mode (auto-reloads on file changes):

```bash
npm run dev
```

Then open **http://localhost:3000**.

Or, to run a production build (closer to how it would actually be used day-to-day):

```bash
npm run build
npm start
```

Either way, all data is stored in `database/todo.db`. Stopping and restarting the app (or your
machine) does not lose any data — it's an ordinary SQLite file on disk.

## Run the tests

```bash
npm test
```

This single command deletes any leftover `tests/test.db` (via `scripts/reset-test-db.js`), then
runs the full Vitest suite against a **fresh, throwaway** database file — it never touches
`database/todo.db`, so running the tests will never affect your real task data.

## Lint

```bash
npm run lint
```

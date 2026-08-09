# todo-nextjs-sqlite

A local-first todo application built with Next.js and SQLite. It runs entirely on your own
machine: no server deployment, no user accounts, single user.

## Features

- Create, edit, and archive tasks (title, description, due date, topic)
- Tasks are never deleted, only archived — archived tasks remain viewable
- Fixed statuses: Todo, In-Progress, Complete
- Sort the task list by topic, status, or due date
- Overdue tasks are visibly flagged (separately from status)
- All data persists in a local SQLite file across restarts

## Documentation

- [`docs/THIRD_PARTY_CODE.md`](docs/THIRD_PARTY_CODE.md) — libraries used and why
- [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) — schema and design decisions
- [`docs/RUNNING_IT.md`](docs/RUNNING_IT.md) — exact install/run/test commands
- [`docs/AI_TRANSCRIPTS.md`](docs/AI_TRANSCRIPTS.md) — AI usage summary

## Quick start

Requires **Node 22.5.0+** (uses the built-in `node:sqlite` module — see `docs/RUNNING_IT.md`).

```bash
npm install
npm run init-db
npm run dev
```

Open http://localhost:3000.

## Tests

```bash
npm test
```

## License

See [`LICENCE`](LICENCE).

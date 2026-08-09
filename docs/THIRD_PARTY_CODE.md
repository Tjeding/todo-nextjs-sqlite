# Third-Party Code

Everything below was installed with `npm install`. No other third-party code (copied snippets,
vendored libraries, etc.) is included in the repository.

## Dependencies

| Package | Why it was chosen |
|---|---|
| [`next`](https://www.npmjs.com/package/next) | The application framework required by the assignment brief; used for routing (App Router), server-rendered pages, API routes, and server actions. |
| [`react`](https://www.npmjs.com/package/react) / [`react-dom`](https://www.npmjs.com/package/react-dom) | Peer dependencies of Next.js, used to build the UI components. |

Note on SQLite: the application does **not** depend on a third-party SQLite driver. It uses Node's
built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) module (stable since Node 22.5). This
was a deliberate choice over a package like `better-sqlite3`: `better-sqlite3` ships a native
binding that has to be compiled (or downloaded as a prebuilt binary) for the machine it runs on,
which is an extra point of failure on a "clean clone, nothing else to hand" install. `node:sqlite`
needs nothing beyond the Node version already required to run the app.

## Dev dependencies

| Package | Why it was chosen |
|---|---|
| [`typescript`](https://www.npmjs.com/package/typescript) | Static typing across the app, API routes, and data layer, to catch schema/shape mistakes before runtime. |
| [`vitest`](https://www.npmjs.com/package/vitest) | Fast test runner with native TypeScript and ESM support and no extra config needed to match the Next.js build tooling. |
| [`eslint`](https://www.npmjs.com/package/eslint) / [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next) | Linting, using the rule set Next.js itself recommends for App Router projects. |
| [`@types/node`](https://www.npmjs.com/package/@types/node), [`@types/react`](https://www.npmjs.com/package/@types/react), [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) | Type definitions for the corresponding runtime packages, so TypeScript can check code that touches them. |

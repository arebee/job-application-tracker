# Job Application Tracker

Local self-hosted job application tracker built with **SvelteKit 5**, **shadcn-svelte**, **SQLite**, and session-based login.

## Features

- Sign in with username/password (single user, seeded on first run)
- CRUD for job applications
- Kanban board with drag-and-drop status changes
- Search, status filter, and sorting on the applications list
- Dashboard with pipeline stats and recently updated applications

## Prerequisites

- Node.js 20+
- npm

## Quick start

See **[SETUP_COMMANDS.md](./SETUP_COMMANDS.md)** for copy-paste terminal commands (including interactive CLI steps).

```bash
cp .env.example .env
# Edit .env (username, password, SESSION_SECRET)
npm install
npm run db:migrate
npm run dev
```

Default local credentials (if using `.env.example` values from the plan):

- Username: `your_username`
- Password: set in `.env` as `AUTH_PASSWORD`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run dev-host` | Development server and make available on local network |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run preview` | Preview production build and make available on local network |
| `npm run db:migrate` | Apply SQLite migrations |
| `npm run db:generate` | Generate Drizzle migration SQL |
| `npm run check` | Typecheck |

## API

REST JSON under `/api` (requires session cookie except `POST /api/auth/login`).

- `POST /api/auth/login` — `{ username, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/password` — change password
- `GET/POST /api/applications`
- `GET/PATCH/DELETE /api/applications/:id`
- `GET /api/stats`

## Data

SQLite file at `./data/app.db` by default (gitignored). Configure with `DATABASE_PATH` in `.env`.

## Production local run

```bash
npm run build
node build
```

Uses `@sveltejs/adapter-node` (port 3000 by default).

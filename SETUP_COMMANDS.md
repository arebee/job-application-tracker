# Interactive setup commands

Run these in your terminal from the project root:

```bash
cd "/Volumes/Marvin/projects/job applicaftion tracker"
```

## 1. Install dependencies (if not already done)

```bash
npm install
```

`better-sqlite3` compiles native code. If install fails with `gyp` / Xcode errors, install Apple Command Line Tools in your **local** terminal (not sandboxed):

```bash
xcode-select --install
```

Then run `npm install` again from the project directory.

## 2. shadcn-svelte components (already added?)

If UI components are missing under `src/lib/components/ui/`, run interactively and accept defaults:

```bash
npx shadcn-svelte@latest add button card input label table select dialog badge separator alert scroll-area sheet
```

Press **Enter** for each prompt. Add more components later the same way.

## 3. Environment file

```bash
cp .env.example .env
```

Edit `.env` — for local dev with plan defaults:

```env
AUTH_USERNAME=your-username
AUTH_PASSWORD=your-password
SESSION_SECRET=change-me-to-any-long-random-string
DATABASE_PATH=./data/app.db
```

## 4. Database migration

```bash
npm run db:migrate
```

## 5. Development server

```bash
npm run dev
```

Open <http://localhost:5173> — sign in with your `.env` credentials.

## 6. Production-style local run

```bash
npm run build
node build
```

Default port is **3000** (adapter-node).

## Optional: regenerate Drizzle SQL after schema changes

```bash
npm run db:generate
npm run db:migrate
```

## Optional: shadcn init (only for a fresh clone without `components.json`)

```bash
npx shadcn-svelte@latest init
```

Accept all defaults (Enter through prompts), or pass flags:

```bash
npx shadcn-svelte@latest init --base-color slate --css src/routes/layout.css --lib-alias '$lib' --components-alias '$lib/components' --utils-alias '$lib/utils' --hooks-alias '$lib/hooks' --ui-alias '$lib/components/ui' --overwrite
```

## Optional: SvelteKit scaffold (reference — already done)

```bash
npx sv create . --template minimal --types ts --add tailwindcss prettier eslint sveltekit-adapter="adapter:node" --no-dir-check --install npm
```

Use interactive mode without flags if you prefer prompts:

```bash
npx sv create . --add tailwindcss
```

Then choose: TypeScript, Prettier, ESLint, **adapter-node**, npm.

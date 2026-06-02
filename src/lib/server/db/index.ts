import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { env } from '$lib/server/env';
// import * as schema from './schema';

const dbPath = resolve(process.cwd(), env.databasePath);
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// export const db = drizzle(sqlite, { schema });
export const db = drizzle({ client:sqlite});
export { sqlite };

import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { config } from 'dotenv';

config();

const dbPath = resolve(process.cwd(), process.env.DATABASE_PATH ?? './data/app.db');
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const migrationsDir = resolve(process.cwd(), 'drizzle');
let files: string[] = [];
try {
	files = readdirSync(migrationsDir)
		.filter((f) => f.endsWith('.sql'))
		.sort();
} catch {
	console.log('No drizzle migrations folder yet. Run: npm run db:generate');
}

for (const file of files) {
	const sql = readFileSync(resolve(migrationsDir, file), 'utf8');
	const hash = file;
	const exists = db.prepare('SELECT 1 FROM __drizzle_migrations WHERE hash = ?').get(hash);
	if (exists) continue;
	db.exec(sql);
	db.prepare('INSERT INTO __drizzle_migrations (hash) VALUES (?)').run(hash);
	console.log(`Applied ${file}`);
}

db.close();
console.log('Migrations complete.');

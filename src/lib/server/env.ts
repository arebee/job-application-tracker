import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
	config({ path: envPath });
}

function required(name: string, fallback?: string): string {
	const value = process.env[name] ?? fallback;
	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

export const env = {
	databasePath: process.env.DATABASE_PATH ?? './data/app.db',
	authUsername: process.env.AUTH_USERNAME ?? 'dontuse-your-username',
	authPassword: process.env.AUTH_PASSWORD ?? 'dontuse-your-password',
	sessionSecret: required('SESSION_SECRET', 'dev-only-change-me-in-production'),
	nodeEnv: process.env.NODE_ENV ?? 'development'
};

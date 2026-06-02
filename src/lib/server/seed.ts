import bcrypt from 'bcrypt';
import { count } from 'drizzle-orm';
import { env } from '$lib/server/env';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export async function ensureSeedUser() {
	const [{ value }] = await db.select({ value: count() }).from(users);
	if (value > 0) return;

	const now = new Date().toISOString();
	const passwordHash = await bcrypt.hash(env.authPassword, 10);
	await db.insert(users).values({
		username: env.authUsername,
		passwordHash,
		createdAt: now,
		updatedAt: now
	});
}

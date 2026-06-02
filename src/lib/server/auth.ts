import bcrypt from 'bcrypt';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { eq, lt } from 'drizzle-orm';
import { SESSION_COOKIE, SESSION_DAYS } from '$lib/constants';
import { env } from '$lib/server/env';
import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema';
import type { User } from '$lib/types';

const nowIso = () => new Date().toISOString();

function addDays(days: number) {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString();
}

function sign(value: string) {
	return createHmac('sha256', env.sessionSecret).update(value).digest('hex');
}

export function createSessionToken(sessionId: string) {
	return `${sessionId}.${sign(sessionId)}`;
}

export function parseSessionToken(token: string | undefined): string | null {
	if (!token) return null;
	const [sessionId, signature] = token.split('.');
	if (!sessionId || !signature) return null;
	const expected = sign(sessionId);
	try {
		const a = Buffer.from(signature);
		const b = Buffer.from(expected);
		if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	} catch {
		return null;
	}
	return sessionId;
}

export async function login(username: string, password: string) {
	const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
	if (!user) return null;
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return null;

	const sessionId = randomBytes(32).toString('hex');
	const createdAt = nowIso();
	await db.insert(sessions).values({
		id: sessionId,
		userId: user.id,
		expiresAt: addDays(SESSION_DAYS),
		createdAt
	});

	return { sessionId, user: { id: user.id, username: user.username } satisfies User };
}

export async function logout(sessionId: string) {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function getUserBySession(sessionId: string): Promise<User | null> {
	await db.delete(sessions).where(lt(sessions.expiresAt, nowIso()));
	const [row] = await db
		.select({ id: users.id, username: users.username })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);
	return row ?? null;
}

export async function changePassword(
	userId: number,
	currentPassword: string,
	newPassword: string
): Promise<{ ok: boolean; message?: string }> {
	const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
	if (!user) return { ok: false, message: 'User not found' };
	const ok = await bcrypt.compare(currentPassword, user.passwordHash);
	if (!ok) return { ok: false, message: 'Current password is incorrect' };
	const passwordHash = await bcrypt.hash(newPassword, 10);
	await db
		.update(users)
		.set({ passwordHash, updatedAt: nowIso() })
		.where(eq(users.id, userId));
	return { ok: true };
}

export function sessionCookieOptions(maxAgeSeconds: number) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: env.nodeEnv === 'production',
		maxAge: maxAgeSeconds
	};
}

export function setSessionCookie(
	cookies: import('@sveltejs/kit').Cookies,
	sessionId: string
) {
	cookies.set(SESSION_COOKIE, createSessionToken(sessionId), sessionCookieOptions(SESSION_DAYS * 86400));
}

export function clearSessionCookie(cookies: import('@sveltejs/kit').Cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function getUserFromCookies(
	cookies: import('@sveltejs/kit').Cookies
): Promise<User | null> {
	const sessionId = parseSessionToken(cookies.get(SESSION_COOKIE));
	if (!sessionId) return null;
	return getUserBySession(sessionId);
}

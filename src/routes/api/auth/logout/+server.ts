import type { RequestHandler } from './$types';
import { ok } from '$lib/api/response';
import { SESSION_COOKIE } from '$lib/constants';
import { clearSessionCookie, logout, parseSessionToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = parseSessionToken(cookies.get(SESSION_COOKIE));
	if (sessionId) await logout(sessionId);
	clearSessionCookie(cookies);
	return ok({ ok: true as const });
};

import { redirect, type Handle } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/constants';
import { parseSessionToken, getUserBySession } from '$lib/server/auth';
import { ensureSeedUser } from '$lib/server/seed';

const publicPaths = new Set(['/login']);
const publicApi = new Set(['/api/auth/login']);

export const handle: Handle = async ({ event, resolve }) => {
	await ensureSeedUser();

	const { pathname } = event.url;
	const isApi = pathname.startsWith('/api');
	const isPublic = publicPaths.has(pathname) || (isApi && publicApi.has(pathname));

	const sessionId = parseSessionToken(event.cookies.get(SESSION_COOKIE));
	const user = sessionId ? await getUserBySession(sessionId) : null;
	event.locals.user = user;

	if (!user && !isPublic) {
		if (isApi) {
			return new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		throw redirect(303, '/login');
	}

	if (user && pathname === '/login') {
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
};

import type { RequestHandler } from './$types';
import { err, ok } from '$lib/api/response';
import { login, setSessionCookie } from '$lib/server/auth';
import { loginSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) return err('Invalid credentials', 400);

	const result = await login(parsed.data.username, parsed.data.password);
	if (!result) return err('Invalid username or password', 401);

	setSessionCookie(cookies, result.sessionId);
	return ok({ user: result.user });
};

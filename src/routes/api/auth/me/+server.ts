import type { RequestHandler } from './$types';
import { ok } from '$lib/api/response';

export const GET: RequestHandler = async ({ locals }) => {
	return ok(locals.user);
};

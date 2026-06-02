import type { RequestHandler } from './$types';
import { ok } from '$lib/api/response';
import { getStats } from '$lib/server/applications';

export const GET: RequestHandler = async () => {
	return ok(await getStats());
};

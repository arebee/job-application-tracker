import type { RequestHandler } from './$types';
import { err, ok } from '$lib/api/response';
import {
	createApplication,
	listApplications
} from '$lib/server/applications';
import { applicationSchema } from '$lib/server/validation';

export const GET: RequestHandler = async ({ url }) => {
	const data = await listApplications({
		q: url.searchParams.get('q') ?? undefined,
		status: url.searchParams.get('status') ?? undefined,
		sort: url.searchParams.get('sort') ?? undefined
	});
	return ok(data);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);
	const parsed = applicationSchema.safeParse(body);
	if (!parsed.success) return err('Invalid application data', 400);
	const data = await createApplication(parsed.data);
	return ok(data, 201);
};

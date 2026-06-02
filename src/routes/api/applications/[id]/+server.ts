import type { RequestHandler } from './$types';
import { err, ok } from '$lib/api/response';
import {
	deleteApplication,
	getApplication,
	updateApplication
} from '$lib/server/applications';
import { applicationUpdateSchema } from '$lib/server/validation';

function parseId(param: string) {
	const id = Number(param);
	return Number.isInteger(id) && id > 0 ? id : null;
}

export const GET: RequestHandler = async ({ params }) => {
	const id = parseId(params.id);
	if (!id) return err('Invalid id', 400);
	const data = await getApplication(id);
	if (!data) return err('Not found', 404);
	return ok(data);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseId(params.id);
	if (!id) return err('Invalid id', 400);
	const body = await request.json().catch(() => null);
	const parsed = applicationUpdateSchema.safeParse(body);
	if (!parsed.success) return err('Invalid application data', 400);
	const data = await updateApplication(id, parsed.data);
	if (!data) return err('Not found', 404);
	return ok(data);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = parseId(params.id);
	if (!id) return err('Invalid id', 400);
	const deleted = await deleteApplication(id);
	if (!deleted) return err('Not found', 404);
	return ok({ ok: true as const });
};

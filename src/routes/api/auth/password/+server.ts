import type { RequestHandler } from './$types';
import { err, ok } from '$lib/api/response';
import { changePassword } from '$lib/server/auth';
import { passwordSchema } from '$lib/server/validation';

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return err('Unauthorized', 401);
	const body = await request.json().catch(() => null);
	const parsed = passwordSchema.safeParse(body);
	if (!parsed.success) return err('Invalid password payload', 400);

	const result = await changePassword(
		locals.user.id,
		parsed.data.currentPassword,
		parsed.data.newPassword
	);
	if (!result.ok) return err(result.message ?? 'Unable to change password', 400);
	return ok({ ok: true as const });
};

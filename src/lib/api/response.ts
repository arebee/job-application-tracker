import { json, type NumericRange } from '@sveltejs/kit';

export function ok<T>(data: T, status = 200) {
	return json({ data }, { status: status as NumericRange<200, 299> });
}

export function err(message: string, status = 400, code?: string) {
	return json({ error: { message, code } }, { status: status as NumericRange<400, 599> });
}

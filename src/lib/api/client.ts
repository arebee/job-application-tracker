type ApiError = { message: string; code?: string };
type ApiResult<T> = { data: T } | { error: ApiError };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(path, {
		...init,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});
	const body = (await res.json()) as ApiResult<T>;
	if (!res.ok || 'error' in body) {
		const message = 'error' in body ? body.error.message : res.statusText;
		throw new Error(message);
	}
	return body.data;
}

export const api = {
	login: (username: string, password: string) =>
		request<{ user: { id: number; username: string } }>('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		}),
	logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
	me: () => request<{ id: number; username: string } | null>('/api/auth/me'),
	changePassword: (currentPassword: string, newPassword: string) =>
		request<{ ok: true }>('/api/auth/password', {
			method: 'PATCH',
			body: JSON.stringify({ currentPassword, newPassword })
		}),
	listApplications: (params?: { q?: string; status?: string; sort?: string }) => {
		const search = new URLSearchParams();
		if (params?.q) search.set('q', params.q);
		if (params?.status) search.set('status', params.status);
		if (params?.sort) search.set('sort', params.sort);
		const qs = search.toString();
		return request<import('$lib/types').Application[]>(
			`/api/applications${qs ? `?${qs}` : ''}`
		);
	},
	getApplication: (id: number) =>
		request<import('$lib/types').Application>(`/api/applications/${id}`),
	createApplication: (body: import('$lib/types').ApplicationInput) =>
		request<import('$lib/types').Application>('/api/applications', {
			method: 'POST',
			body: JSON.stringify(body)
		}),
	updateApplication: (id: number, body: Partial<import('$lib/types').ApplicationInput>) =>
		request<import('$lib/types').Application>(`/api/applications/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(body)
		}),
	deleteApplication: (id: number) =>
		request<{ ok: true }>(`/api/applications/${id}`, { method: 'DELETE' }),
	stats: () => request<import('$lib/types').StatsResponse>('/api/stats')
};

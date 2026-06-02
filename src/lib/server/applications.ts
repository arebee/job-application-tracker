import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import {
	APPLICATION_STATUSES,
	type ApplicationStatus
} from '$lib/constants';
import type { Application, ApplicationInput, StatsResponse } from '$lib/types';
import { db } from '$lib/server/db';
import { applications } from '$lib/server/db/schema';

const nowIso = () => new Date().toISOString();

function rowToApp(row: typeof applications.$inferSelect): Application {
	return {
		id: row.id,
		company: row.company,
		role: row.role,
		status: row.status as ApplicationStatus,
		appliedAt: row.appliedAt,
		url: row.url,
		location: row.location,
		notes: row.notes,
		sortOrder: row.sortOrder,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}

export async function listApplications(params: {
	q?: string;
	status?: string;
	sort?: string;
}): Promise<Application[]> {
	const conditions = [];
	if (params.status && APPLICATION_STATUSES.includes(params.status as ApplicationStatus)) {
		conditions.push(eq(applications.status, params.status));
	}
	if (params.q?.trim()) {
		const term = `%${params.q.trim()}%`;
		conditions.push(
			or(
				like(applications.company, term),
				like(applications.role, term),
				like(applications.location, term),
				like(applications.notes, term)
			)
		);
	}

	const order =
		params.sort === 'company'
			? [asc(applications.company), asc(applications.role)]
			: params.sort === 'applied'
				? [desc(applications.appliedAt), desc(applications.updatedAt)]
				: [desc(applications.updatedAt)];

	const rows = await db
		.select()
		.from(applications)
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(...order);

	return rows.map(rowToApp);
}

export async function getApplication(id: number): Promise<Application | null> {
	const [row] = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
	return row ? rowToApp(row) : null;
}

async function nextSortOrder(status: ApplicationStatus) {
	const [row] = await db
		.select({ max: sql<number>`coalesce(max(${applications.sortOrder}), -1)` })
		.from(applications)
		.where(eq(applications.status, status));
	return (row?.max ?? -1) + 1;
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
	const now = nowIso();
	const status = input.status ?? 'wishlist';
	const sortOrder = input.sortOrder ?? (await nextSortOrder(status));
	const [row] = await db
		.insert(applications)
		.values({
			company: input.company,
			role: input.role,
			status,
			appliedAt: input.appliedAt ?? null,
			url: input.url ?? null,
			location: input.location ?? null,
			notes: input.notes ?? null,
			sortOrder,
			createdAt: now,
			updatedAt: now
		})
		.returning();
	return rowToApp(row);
}

export async function updateApplication(
	id: number,
	input: Partial<ApplicationInput>
): Promise<Application | null> {
	const existing = await getApplication(id);
	if (!existing) return null;

	const now = nowIso();
	const status = input.status ?? existing.status;
	let sortOrder = input.sortOrder ?? existing.sortOrder;
	if (input.status && input.status !== existing.status && input.sortOrder === undefined) {
		sortOrder = await nextSortOrder(input.status);
	}

	const [row] = await db
		.update(applications)
		.set({
			company: input.company ?? existing.company,
			role: input.role ?? existing.role,
			status,
			appliedAt: input.appliedAt !== undefined ? input.appliedAt : existing.appliedAt,
			url: input.url !== undefined ? input.url : existing.url,
			location: input.location !== undefined ? input.location : existing.location,
			notes: input.notes !== undefined ? input.notes : existing.notes,
			sortOrder,
			updatedAt: now
		})
		.where(eq(applications.id, id))
		.returning();

	return row ? rowToApp(row) : null;
}

export async function deleteApplication(id: number): Promise<boolean> {
	const result = await db.delete(applications).where(eq(applications.id, id));
	return (result.changes ?? 0) > 0;
}

export async function getStats(): Promise<StatsResponse> {
	const rows = await db.select().from(applications);
	const byStatus = Object.fromEntries(
		APPLICATION_STATUSES.map((s) => [s, 0])
	) as Record<ApplicationStatus, number>;
	for (const row of rows) {
		const status = row.status as ApplicationStatus;
		if (byStatus[status] !== undefined) byStatus[status]++;
	}

	const now = Date.now();
	const day = 86400000;
	const recent7Days = rows.filter(
		(r) => now - new Date(r.createdAt).getTime() <= 7 * day
	).length;
	const recent30Days = rows.filter(
		(r) => now - new Date(r.createdAt).getTime() <= 30 * day
	).length;

	const recent = [...rows]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.slice(0, 5)
		.map(rowToApp);

	return { byStatus, recent7Days, recent30Days, recent };
}

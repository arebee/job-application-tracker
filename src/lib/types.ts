import type { ApplicationStatus } from '$lib/constants';

export type User = {
	id: number;
	username: string;
};

export type Application = {
	id: number;
	company: string;
	role: string;
	status: ApplicationStatus;
	appliedAt: string | null;
	url: string | null;
	location: string | null;
	notes: string | null;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
};

export type ApplicationInput = {
	company: string;
	role: string;
	status?: ApplicationStatus;
	appliedAt?: string | null;
	url?: string | null;
	location?: string | null;
	notes?: string | null;
	sortOrder?: number;
};

export type StatsResponse = {
	byStatus: Record<ApplicationStatus, number>;
	recent7Days: number;
	recent30Days: number;
	recent: Application[];
};

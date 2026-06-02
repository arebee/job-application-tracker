import { z } from 'zod';
import { APPLICATION_STATUSES } from '$lib/constants';

export const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
});

export const passwordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(8)
});

export const applicationSchema = z.object({
	company: z.string().min(1),
	role: z.string().min(1),
	status: z.enum(APPLICATION_STATUSES).optional(),
	appliedAt: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	sortOrder: z.number().int().optional()
});

export const applicationUpdateSchema = applicationSchema.partial();

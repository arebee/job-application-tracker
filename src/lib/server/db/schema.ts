import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at').notNull()
});

export const applications = sqliteTable('applications', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	company: text('company').notNull(),
	role: text('role').notNull(),
	status: text('status').notNull(),
	appliedAt: text('applied_at'),
	url: text('url'),
	location: text('location'),
	notes: text('notes'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

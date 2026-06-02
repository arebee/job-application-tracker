export const APPLICATION_STATUSES = [
	'wishlist',
	'applied',
	'screening',
	'interview',
	'offer',
	'rejected',
	'withdrawn'
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
	wishlist: 'Wishlist',
	applied: 'Applied',
	screening: 'Screening',
	interview: 'Interview',
	offer: 'Offer',
	rejected: 'Rejected',
	withdrawn: 'Withdrawn'
};

export const SESSION_COOKIE = 'session';
export const SESSION_DAYS = 14;

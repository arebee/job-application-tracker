<script lang="ts">
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { api } from '$lib/api/client';

	let { children, user } = $props<{
		children: import('svelte').Snippet;
		user: { id: number; username: string };
	}>();

	const links = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/applications', label: 'Applications' },
		{ href: '/kanban', label: 'Kanban' }
	];

	async function logout() {
		await api.logout();
		await invalidateAll();
		goto('/login');
	}
</script>

<div class="bg-background text-foreground min-h-screen">
	<header class="border-border border-b">
		<div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
			<a href="/dashboard" class="text-lg font-semibold tracking-tight">Job Tracker</a>
			<Separator orientation="vertical" class="h-6" />
			<nav class="flex flex-1 gap-1">
				{#each links as link}
					<a
						href={link.href}
						class="hover:bg-muted rounded-none px-3 py-1.5 text-sm {page.url.pathname.startsWith(
							link.href
						)
							? 'bg-muted font-medium'
							: ''}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<span class="text-muted-foreground text-sm">{user.username}</span>
			<Button variant="outline" size="sm" onclick={logout}>Log out</Button>
		</div>
	</header>
	<main class="mx-auto max-w-6xl px-4 py-6">
		{@render children()}
	</main>
</div>

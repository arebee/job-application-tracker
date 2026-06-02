<script lang="ts">
	import { onMount } from 'svelte';
	import { APPLICATION_STATUSES, type ApplicationStatus } from '$lib/constants';
	import type { Application } from '$lib/types';
	import { api } from '$lib/api/client';
	import StatusColumn from '$lib/components/StatusColumn.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';

	let items = $state<Application[]>([]);
	let error = $state('');
	let dragId = $state<number | null>(null);

	const byStatus = $derived(
		Object.fromEntries(
			APPLICATION_STATUSES.map((s) => [s, items.filter((a) => a.status === s).sort((a, b) => a.sortOrder - b.sortOrder)])
		) as Record<ApplicationStatus, Application[]>
	);

	async function load() {
		try {
			items = await api.listApplications({ sort: 'updated' });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load board';
		}
	}

	onMount(load);

	function onDragStart(e: DragEvent, app: Application) {
		dragId = app.id;
		e.dataTransfer?.setData('text/plain', String(app.id));
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
	}

	async function onDrop(e: DragEvent, status: ApplicationStatus) {
		e.preventDefault();
		const id = dragId ?? Number(e.dataTransfer?.getData('text/plain'));
		if (!id) return;
		const app = items.find((a) => a.id === id);
		if (!app || app.status === status) return;

		const previous = [...items];
		const sortOrder = (byStatus[status]?.length ?? 0);
		items = items.map((a) => (a.id === id ? { ...a, status, sortOrder } : a));

		try {
			await api.updateApplication(id, { status, sortOrder });
			await load();
		} catch (err) {
			items = previous;
			error = err instanceof Error ? err.message : 'Failed to move card';
		} finally {
			dragId = null;
		}
	}
</script>

<svelte:head><title>Kanban · Job Tracker</title></svelte:head>

<div class="mb-6 flex items-center justify-between gap-4">
	<h1 class="text-2xl font-semibold tracking-tight">Kanban</h1>
	<Button variant="outline" onclick={load}>Refresh</Button>
</div>

{#if error}
	<Alert.Root variant="destructive" class="mb-4">
		<Alert.Description>{error}</Alert.Description>
	</Alert.Root>
{/if}

<div class="flex gap-3 overflow-x-auto pb-4">
	{#each APPLICATION_STATUSES as status}
		<StatusColumn
			{status}
			items={byStatus[status]}
			ondragover={onDragOver}
			ondrop={(e) => onDrop(e, status)}
			ondragstart={onDragStart}
		/>
	{/each}
</div>

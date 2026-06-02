<script lang="ts">
	import { onMount } from 'svelte';
	import { APPLICATION_STATUSES, STATUS_LABELS } from '$lib/constants';
	import { api } from '$lib/api/client';
	import type { StatsResponse } from '$lib/types';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let stats = $state<StatsResponse | null>(null);
	let error = $state('');

	onMount(async () => {
		try {
			stats = await api.stats();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load stats';
		}
	});

	const activeCount = $derived(
		stats
			? stats.byStatus.applied +
				stats.byStatus.screening +
				stats.byStatus.interview +
				stats.byStatus.offer
			: 0
	);
</script>

<svelte:head><title>Dashboard · Job Tracker</title></svelte:head>

<h1 class="mb-6 text-2xl font-semibold tracking-tight">Dashboard</h1>

{#if error}
	<p class="text-destructive text-sm">{error}</p>
{:else if !stats}
	<p class="text-muted-foreground text-sm">Loading…</p>
{:else}
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header>
				<Card.Description>Active pipeline</Card.Description>
				<Card.Title class="text-3xl">{activeCount}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Last 7 days</Card.Description>
				<Card.Title class="text-3xl">{stats.recent7Days}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Last 30 days</Card.Description>
				<Card.Title class="text-3xl">{stats.recent30Days}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Offers</Card.Description>
				<Card.Title class="text-3xl">{stats.byStatus.offer}</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	<div class="mb-8 flex flex-wrap gap-2">
		{#each APPLICATION_STATUSES as status}
			<Badge variant="outline">
				{STATUS_LABELS[status]}: {stats.byStatus[status]}
			</Badge>
		{/each}
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Recently updated</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Company</Table.Head>
						<Table.Head>Role</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Updated</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each stats.recent as app}
						<Table.Row>
							<Table.Cell class="font-medium">{app.company}</Table.Cell>
							<Table.Cell>{app.role}</Table.Cell>
							<Table.Cell>
								<Badge variant="secondary">{STATUS_LABELS[app.status]}</Badge>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground text-sm">
								{new Date(app.updatedAt).toLocaleDateString()}
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={4} class="text-muted-foreground text-center">
								No applications yet.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
{/if}

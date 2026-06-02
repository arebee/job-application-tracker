<script lang="ts">
	import type { Application } from '$lib/types';
	import { STATUS_LABELS } from '$lib/constants';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let {
		application,
		draggable = false,
		ondragstart
	}: {
		application: Application;
		draggable?: boolean;
		ondragstart?: (e: DragEvent) => void;
	} = $props();
</script>

<Card.Root
	class="cursor-grab active:cursor-grabbing"
	{draggable}
	{ondragstart}
	role="listitem"
>
	<Card.Header class="gap-1 p-3">
		<div class="flex items-start justify-between gap-2">
			<Card.Title class="text-sm leading-tight">{application.company}</Card.Title>
			<Badge variant="secondary" class="shrink-0">{STATUS_LABELS[application.status]}</Badge>
		</div>
		<Card.Description class="text-xs">{application.role}</Card.Description>
	</Card.Header>
	{#if application.location || application.appliedAt}
		<Card.Content class="text-muted-foreground px-3 pt-0 pb-3 text-xs">
			{#if application.location}<p>{application.location}</p>{/if}
			{#if application.appliedAt}<p>Applied {application.appliedAt}</p>{/if}
		</Card.Content>
	{/if}
</Card.Root>

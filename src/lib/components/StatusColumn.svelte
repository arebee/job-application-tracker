<script lang="ts">
	import type { Application } from '$lib/types';
	import type { ApplicationStatus } from '$lib/constants';
	import { STATUS_LABELS } from '$lib/constants';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import ApplicationCard from '$lib/components/ApplicationCard.svelte';

	let {
		status,
		items,
		ondragover,
		ondrop,
		ondragstart
	}: {
		status: ApplicationStatus;
		items: Application[];
		ondragover: (e: DragEvent) => void;
		ondrop: (e: DragEvent) => void;
		ondragstart: (e: DragEvent, app: Application) => void;
	} = $props();
</script>

<section
	class="border-border bg-muted/30 flex min-h-[420px] min-w-[220px] flex-1 flex-col rounded-none border"
	{ondragover}
	{ondrop}
>
	<div class="border-border flex items-center justify-between border-b px-3 py-2">
		<h2 class="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
		<Badge variant="outline">{items.length}</Badge>
	</div>
	<ScrollArea.Root class="h-[360px] flex-1">
		<div class="flex flex-col gap-2 p-2" role="list">
			{#each items as app (app.id)}
				<ApplicationCard
					application={app}
					draggable={true}
					ondragstart={(e) => ondragstart(e, app)}
				/>
			{/each}
		</div>
	</ScrollArea.Root>
</section>

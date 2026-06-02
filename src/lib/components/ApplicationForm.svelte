<script lang="ts">
	import {
		APPLICATION_STATUSES,
		STATUS_LABELS,
		type ApplicationStatus
	} from '$lib/constants';
	import type { ApplicationInput } from '$lib/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		value = $bindable<ApplicationInput>({
			company: '',
			role: '',
			status: 'wishlist',
			appliedAt: null,
			url: null,
			location: null,
			notes: null
		})
	} = $props<{ value?: ApplicationInput }>();

	const statusItems = APPLICATION_STATUSES.map((s) => ({
		value: s,
		label: STATUS_LABELS[s]
	}));

	let statusValue = $state<ApplicationStatus>(value.status ?? 'wishlist');

	$effect(() => {
		value.status = statusValue;
	});

	export function toInput(): ApplicationInput {
		return {
			company: value.company.trim(),
			role: value.role.trim(),
			status: statusValue,
			appliedAt: value.appliedAt || null,
			url: value.url || null,
			location: value.location || null,
			notes: value.notes || null
		};
	}
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="space-y-2 sm:col-span-2">
		<Label for="company">Company</Label>
		<Input id="company" bind:value={value.company} required />
	</div>
	<div class="space-y-2 sm:col-span-2">
		<Label for="role">Role</Label>
		<Input id="role" bind:value={value.role} required />
	</div>
	<div class="space-y-2">
		<Label>Status</Label>
		<Select.Root type="single" bind:value={statusValue}>
			<Select.Trigger class="w-full">
				{STATUS_LABELS[statusValue]}
			</Select.Trigger>
			<Select.Content>
				{#each statusItems as item}
					<Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
	<div class="space-y-2">
		<Label for="appliedAt">Applied date</Label>
		<Input
			id="appliedAt"
			type="date"
			value={value.appliedAt ?? ''}
			oninput={(e) => {
				const v = (e.currentTarget as HTMLInputElement).value;
				value.appliedAt = v || null;
			}}
		/>
	</div>
	<div class="space-y-2">
		<Label for="location">Location</Label>
		<Input id="location" bind:value={value.location} />
	</div>
	<div class="space-y-2">
		<Label for="url">Job URL</Label>
		<Input id="url" type="url" bind:value={value.url} placeholder="https://" />
	</div>
	<div class="space-y-2 sm:col-span-2">
		<Label for="notes">Notes</Label>
		<Input id="notes" bind:value={value.notes} />
	</div>
</div>

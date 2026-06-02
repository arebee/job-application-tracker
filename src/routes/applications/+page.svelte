<script lang="ts">
	import { onMount } from 'svelte';
	import {
		APPLICATION_STATUSES,
		STATUS_LABELS,
		type ApplicationStatus
	} from '$lib/constants';
	import type { Application, ApplicationInput } from '$lib/types';
	import { api } from '$lib/api/client';
	import ApplicationForm from '$lib/components/ApplicationForm.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let items = $state<Application[]>([]);
	let q = $state('');
	let statusFilter = $state<string>('all');
	let sort = $state('updated');
	let error = $state('');
	let loading = $state(false);
	let dialogOpen = $state(false);
	let editing = $state<Application | null>(null);
	let form = $state<ApplicationInput>(emptyForm());
	let formRef = $state<ApplicationForm | null>(null);

	function emptyForm(): ApplicationInput {
		return {
			company: '',
			role: '',
			status: 'wishlist',
			appliedAt: null,
			url: null,
			location: null,
			notes: null
		};
	}

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	async function load() {
		loading = true;
		error = '';
		try {
			items = await api.listApplications({
				q: q || undefined,
				status: statusFilter === 'all' ? undefined : statusFilter,
				sort
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load';
		} finally {
			loading = false;
		}
	}

	function scheduleLoad() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => load(), 300);
	}

	onMount(load);

	function openCreate() {
		editing = null;
		form = emptyForm();
		dialogOpen = true;
	}

	function openEdit(app: Application) {
		editing = app;
		form = {
			company: app.company,
			role: app.role,
			status: app.status,
			appliedAt: app.appliedAt,
			url: app.url,
			location: app.location,
			notes: app.notes
		};
		dialogOpen = true;
	}

	async function save() {
		const payload = formRef?.toInput() ?? form;
		try {
			if (editing) {
				await api.updateApplication(editing.id, payload);
			} else {
				await api.createApplication(payload);
			}
			dialogOpen = false;
			await load();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Save failed';
		}
	}

	async function remove(app: Application) {
		if (!confirm(`Delete ${app.company} – ${app.role}?`)) return;
		try {
			await api.deleteApplication(app.id);
			await load();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Delete failed';
		}
	}
</script>

<svelte:head><title>Applications · Job Tracker</title></svelte:head>

<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
	<h1 class="text-2xl font-semibold tracking-tight">Applications</h1>
	<Button onclick={openCreate}>Add application</Button>
</div>

{#if error}
	<Alert.Root variant="destructive" class="mb-4">
		<Alert.Description>{error}</Alert.Description>
	</Alert.Root>
{/if}

<Card.Root class="mb-6">
	<Card.Content class="flex flex-wrap gap-3 pt-6">
		<Input
			class="max-w-xs"
			placeholder="Search company, role, notes…"
			bind:value={q}
			oninput={scheduleLoad}
		/>
		<Select.Root
			type="single"
			value={statusFilter}
			onValueChange={(v) => {
				statusFilter = v ?? 'all';
				load();
			}}
		>
			<Select.Trigger class="w-[180px]">
				{statusFilter === 'all'
					? 'All statuses'
					: STATUS_LABELS[statusFilter as ApplicationStatus]}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="all" label="All statuses">All statuses</Select.Item>
				{#each APPLICATION_STATUSES as s}
					<Select.Item value={s} label={STATUS_LABELS[s]}>{STATUS_LABELS[s]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Select.Root
			type="single"
			value={sort}
			onValueChange={(v) => {
				sort = v ?? 'updated';
				load();
			}}
		>
			<Select.Trigger class="w-[160px]">
				{sort === 'company' ? 'Company' : sort === 'applied' ? 'Applied date' : 'Recently updated'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="updated" label="Recently updated">Recently updated</Select.Item>
				<Select.Item value="company" label="Company">Company</Select.Item>
				<Select.Item value="applied" label="Applied date">Applied date</Select.Item>
			</Select.Content>
		</Select.Root>
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Content class="pt-6">
		{#if loading}
			<p class="text-muted-foreground text-sm">Loading…</p>
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Company</Table.Head>
						<Table.Head>Role</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Applied</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each items as app (app.id)}
						<Table.Row>
							<Table.Cell class="font-medium">
								{#if app.url}
									<a href={app.url} target="_blank" rel="noreferrer" class="hover:underline">
										{app.company}
									</a>
								{:else}
									{app.company}
								{/if}
							</Table.Cell>
							<Table.Cell>{app.role}</Table.Cell>
							<Table.Cell>
								<Badge variant="secondary">{STATUS_LABELS[app.status]}</Badge>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground text-sm">
								{app.appliedAt ?? '—'}
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="ghost" size="sm" onclick={() => openEdit(app)}>Edit</Button>
								<Button variant="ghost" size="sm" onclick={() => remove(app)}>Delete</Button>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="text-muted-foreground text-center">
								No applications found.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{editing ? 'Edit application' : 'New application'}</Dialog.Title>
		</Dialog.Header>
		<ApplicationForm bind:this={formRef} bind:value={form} />
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
			<Button onclick={save}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

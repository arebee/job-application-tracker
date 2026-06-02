<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/AppShell.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if page.url.pathname === '/login'}
	{@render children()}
{:else if data.user}
	<AppShell user={data.user}>
		{@render children()}
	</AppShell>
{:else}
	{@render children()}
{/if}

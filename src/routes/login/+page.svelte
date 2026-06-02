<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function submit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';
		try {
			await api.login(username, password);
			await invalidateAll();
			goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-background flex min-h-screen items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Sign in</Card.Title>
			<Card.Description>Job application tracker</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="space-y-4" onsubmit={submit}>
				{#if error}
					<Alert.Root variant="destructive">
						<Alert.Title>Unable to sign in</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Root>
				{/if}
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input id="username" bind:value={username} autocomplete="username" required />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						autocomplete="current-password"
						required
					/>
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Signing in…' : 'Sign in'}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>

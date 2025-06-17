<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { cn } from "$lib/shadcn-utils";
	import { DeleteIcon, SearchIcon } from "@lucide/svelte";

	let {
		value = $bindable(""),
		placeholder = $bindable(""),
		showDeleteIcon = $bindable(true),
	}: {
		value: string;
		placeholder: string;
		showDeleteIcon?: boolean;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
</script>

<div class="relative flex w-full items-center">
	<SearchIcon class="absolute top-1/2 left-4 size-4 -translate-y-1/2 transform opacity-70" />
	<Input bind:value class="px-12 py-5" {placeholder} bind:ref={inputRef} />
	{#if showDeleteIcon}
		<button
			class={cn(
				"absolute top-1/2 right-4 -translate-y-1/2 transform p-0 transition-all",
				value.length > 0 ? "opacity-70" : "opacity-0",
			)}
			onclick={() => {
				value = "";
				inputRef?.focus();
			}}
		>
			<DeleteIcon class="size-4" />
		</button>
	{/if}
</div>

<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/shadcn-utils";
	import type { TOCItem } from "$lib/types";
	import TocTree from "./toc-tree.svelte";

	let { entries }: { entries: TOCItem[] } = $props();

	let currentLevel = $derived(entries[0]?.level || 0);
</script>

<ol
	class={cn(
		"list-outside list-decimal pl-8 text-base",
		[
			"",
			"list-[upper-roman] space-y-4",
			"list-decimal space-y-1",
			"list-[lower-alpha] space-y-0.5",
		][currentLevel],
	)}
>
	{#each entries as entry}
		<li class={cn("text-base", ["", "space-y-2 text-lg", "space-y-1"][currentLevel])}>
			<div
				class={cn(
					"relative left-1 hover:underline hover:decoration-dashed hover:underline-offset-4",
					["", "font-bold uppercase", "font-semibold"][currentLevel],
				)}
			>
				<a href="#{entry.id}">{entry.title}</a>
			</div>

			{#if entry.children.length > 0}
				<TocTree entries={entry.children} />
			{/if}
		</li>
	{/each}
</ol>

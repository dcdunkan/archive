<script lang="ts">
	import SearchInput from "$lib/components/search-input.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowRightIcon } from "@lucide/svelte";
	import fuzzysort from "fuzzysort";
	import type { PageProps } from "./$types";
  import { pluralize } from "$lib/helpers";

	let { data }: PageProps = $props();

	let searchString = $state("");

	const searchResults = $derived.by(() => {
		return fuzzysort.go(searchString, data.courses, {
			keys: ["code", "name"],
			all: true,
		});
	});
</script>

<div class="bg-background sticky top-[5em] z-10">
	<SearchInput
		bind:value={searchString}
		placeholder="Search among {data.courses.length} {pluralize(data.courses.length, "course")}"
	/>
</div>

<div class="grid grid-cols-1 gap-1 sm:grid-cols-2">
	{#each searchResults as course}
		<div class="hover:bg-accent/20 flex w-full place-items-center justify-between gap-2 border p-6 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg sm:rounded-lg">
			<div class="space-y-1">
				<div class="font-serif text-xl">{course.obj.name}</div>
				<div class="text-muted-foreground text-xs">
					{course.obj.code} &middot; {course.obj.modules.length} modules &middot;
					<!-- {course.obj.documents} documents -->
				</div>
			</div>
			<Button
				variant="outline"
				class="aspect-square size-10"
				href="/courses/{course.obj.code}"
			>
				<ArrowRightIcon />
			</Button>
		</div>
	{/each}
</div>

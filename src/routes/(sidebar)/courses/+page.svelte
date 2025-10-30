<script lang="ts">
	import SearchInput from "$lib/components/search-input.svelte";
	import { pluralize } from "$lib/helpers";
	import fuzzysort from "fuzzysort";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let searchString = $state("");

	const searchResults = $derived.by(() => {
		return fuzzysort.go(searchString, data.courses, {
			keys: ["code", "name", "description"],
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

<div class="grid grid-cols-1 gap-1">
	{#each searchResults as course}
		<a
			href="/courses/{course.obj.code}"
			class="block hover:bg-muted gap-2 border px-6 py-4 transition-all duration-300 first:rounded-t-lg last:rounded-b-lg sm:rounded-lg space-y-2"
		>
			<div class="space-y-0.5">
			<div class="font-serif text-lg leading-snug">{course.obj.name}</div>
			<div class="text-pretty text-muted-foreground text-sm">
				{course.obj.description}
			</div>
			</div>
			<div class="text-muted-foreground text-sm">
				{course.obj.code} &middot; {course.obj.modules.length} modules
				<!--  &middot; {course.obj.documents} documents -->
			</div>
		</a>
	{/each}
</div>

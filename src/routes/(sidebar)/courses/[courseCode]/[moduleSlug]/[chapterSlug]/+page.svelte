<script lang="ts">
	import { roman } from "$lib/helpers";
	import BiggerPicture from "bigger-picture";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let { chapter, course, module } = $derived(data);

	onMount(() => {
		const bp = BiggerPicture({
			target: document.body,
		});
		const images = document.querySelectorAll("img");
		for (const image of images) {
			image.addEventListener("click", (e) => {
				if (e.currentTarget == null) return;
				bp.open({ items: images, el: e.currentTarget });
			});
		}
	});
</script>

<svelte:head>
	<!-- todo: revisit here -->
	<title>{chapter.title}</title>

	<link rel="stylesheet" href="http://localhost:8000/diagrams/styles.css" />
	<!-- no need to include katex stylesheet as we are only dealing with mathml for now. as lightweight as possible -->
	<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" /> -->
</svelte:head>

<div class="text-muted-foreground flex gap-2 place-items-center">
	<a href="/courses/{course.code}">{course.name}</a> / <!-- <ChevronRightIcon class="size-4 inline-block" /> -->
	<a href="/courses/{course.code}/{module.slug}">Module {roman(module.number)}</a> /
</div>

<div id="tap-markdown-preview">
	{@html chapter.content}
</div>

<div>
	<div class="sm:flex sm:justify-between sm:gap-2 sm:space-y-0 space-y-2 sm:place-items-center">
		{#if data.previousChapter != null}
			<a
				href={data.previousChapter.slug}
				class="border hover:border-primary duration-300 transition-all sm:w-full rounded-sm border-l-8 px-4 py-3 flex gap-2 place-items-center text-left"
			>
				<div>
					<div class="text-sm text-muted-foreground italic">Previous Chapter</div>
					<div class="line-clamp-1 truncate">
						{data.previousChapter.title}
					</div>
				</div>
			</a>
		{:else}
			<div class="sm:w-full"></div>
		{/if}
		{#if data.nextChapter != null}
			<a
				href={data.nextChapter.slug}
				class="border hover:border-primary duration-300 transition-all rounded-sm px-4 py-3 border-r-8 text-right sm:w-full"
			>
				<div class="text-sm text-muted-foreground italic">Next Chapter</div>
				<div class="line-clamp-1 truncate">
					{data.nextChapter.title}
				</div>
			</a>
		{:else}
			<div class="sm:w-full"></div>
		{/if}
	</div>
</div>

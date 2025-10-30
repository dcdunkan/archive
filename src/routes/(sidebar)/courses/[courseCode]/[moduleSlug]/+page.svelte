<script lang="ts">
	import { roman } from "$lib/helpers";
	import type { PageProps } from "./$types";
	import StructureTree from "./structure-tree.svelte";

	let { data }: PageProps = $props();
	let { course, module } = $derived(data); // comment for remembering this realization moment: ALWAYS FRICKING DERIVE.

	// todo: support for glossary. when some term is clicked, show a popover with
	// relevant explanations and meaning and link to external stuff.
	// markdown should introduce a specific syntax for marking and at-build time
	// terms should also be indexed
</script>

<svelte:head>
	<title>{module.name} | {course.name}</title>
</svelte:head>

<div class="space-y-2">
	<div class="text-muted-foreground flex gap-2 place-items-center">
		<a href="/courses/{course.code}">{course.name}</a> / <!-- <ChevronRightIcon class="size-4 inline-block" /> -->
		<span class="text-primary">Module {roman(module.number)}</span>
	</div>
	<h1 class="text-4xl font-semibold text-balance">{module.name}</h1>

	<p class="mt-4 text-muted-foreground text-pretty">{module.syllabus.join(", ")}</p>
</div>

<div class="space-y-4">
	<h2 class="text-xl font-semibold">Chapters</h2>

	<div class="space-y-3 border-l pl-4">
		{#each module.chapters as chapter}
			<a
				href="/courses/{course.code}/{module.slug}/{chapter.slug}"
				class="flex flex-col gap-4 rounded-lg border px-4 py-3 transition-colors duration-150 hover:bg-muted"
			>
				<div class="flex items-start gap-3 min-w-0">
					<div class="min-h-6 min-w-6 h-6 w-6 flex place-content-center items-center rounded-full border text-xs text-muted-foreground">
						{chapter.number}
					</div>
					<div>
						<span class="font-serif text-base md:text-lg leading-snug">{chapter.title}</span>
						<div class="line-clamp-1 text-xs md:text-sm text-muted-foreground">
							{chapter.structure.map((item) => item.title).join(", ")}
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<div class="space-y-4">
	<h2 class="text-xl font-semibold">Table of Contents</h2>

	<div class="space-y-3 border-l pl-8">
		<ol class="list-outside pl-6 text-base list-[upper-roman] space-y-4">
			{#each module.chapters as chapter}
				<li class="space-y-2 text-lg">
					<div class="font-bold uppercase">
						<a href="/courses/{course.code}/{module.slug}/{chapter.slug}">{chapter.title}</a>
					</div>

					{#if chapter.structure.length > 0}
						<StructureTree
							entries={chapter.structure}
							path="/courses/{course.code}/{module.slug}/{chapter.slug}"
						/>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</div>

<!-- <div class="flex min-h-svh flex-col items-center justify-center space-y-8">
	<div class="space-y-2 text-center">
		<div class="font-serif text-xl">Module {roman(module.number)}</div>
		<div class="px-6 font-serif text-5xl font-bold">{module.name}</div>
	</div>

	<div class="flex w-full justify-center">
		<Button size="lg" href="#tap-markdown-preview"><BookOpenIcon /> Start Reading</Button>
	</div>

	<div class="flex w-full flex-col items-center justify-center gap-4 font-serif text-xl">
		<a href="#tap-table-of-contents">Table of Contents</a>
		<a href="#tap-documents">Documents</a>
		<a href="#tap-videos">Videos & Playlists</a>
		<a href="#tap-questions">Questions & Answers</a>
		<a href="#tap-figures">Figures</a>
		<a href="#tap-tables">Tables</a>
		<a href="#tap-glossary">Glossary</a>
	</div>
</div> -->

<!-- <div class="snap-start scroll-mt-24 space-y-4" id="tap-table-of-contents">
	<FancyHeader class="font-serif text-2xl">Table of Contents</FancyHeader>
	<div class={"h-full overflow-hidden px-4 transition-[max-height] duration-500 ease-in-out will-change-[max-height]"}>
		<TocTree entries={module.hierarchy} />
	</div>
</div> -->

<!-- <div id="tap-markdown-preview" class="snap-y snap-start scroll-mt-24">
	{#each module.parts as part}
		<div class="min-h-svh">
			{@html part}
		</div>
	{/each}
</div> -->

<!-- <div class="min-h-[25svh] snap-start space-y-4" id="tap-module-start"></div> -->

<!-- <div class="snap-start scroll-mt-24 space-y-4" id="tap-documents">
	<FancyHeader class="font-serif text-2xl">Documents</FancyHeader>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-videos">
	<FancyHeader class="font-serif text-2xl">Videos & Playlists</FancyHeader>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-questions">
	<FancyHeader class="font-serif text-2xl">Questions & Answers</FancyHeader>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-figures">
	<FancyHeader class="font-serif text-2xl">Figures</FancyHeader>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-tables">
	<FancyHeader class="font-serif text-2xl">Tables</FancyHeader>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-glossary">
	<FancyHeader class="font-serif text-2xl">Glossary</FancyHeader>
</div> -->

<!-- todo: link related stuff and modules or short info -->

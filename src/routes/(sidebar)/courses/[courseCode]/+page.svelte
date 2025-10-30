<script lang="ts">
	import { pluralize, roman } from "$lib/helpers";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let { course } = $derived(data);
</script>

<svelte:head>
	<title>{course.name}</title>
</svelte:head>

<div>
	<h1 class="text-muted-foreground">{course.code}</h1>
	<h1 class="text-3xl font-semibold text-balance">{course.name}</h1>

	<p class="mt-2 text-muted-foreground text-pretty">{course.description}</p>
</div>

{#if course.preamble && course.preamble.length}
	<div class="space-y-4">
		<h2 class="text-xl font-semibold">Preamble</h2>
		<p class="text-pretty">{course.preamble}</p>
	</div>
{/if}

<div class="space-y-4">
	<!-- <FancyHeader class="font-serif text-2xl">Modules</FancyHeader> -->
	<h2 class="text-xl font-semibold">{pluralize(course.modules.length, "Module")}</h2>

	<div class="flex flex-col space-y-4">
		{#each course.modules as module, i}
			<a
				href="/courses/{course.code}/{module.slug}"
				class="group block rounded-lg border p-4 transition-all duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
			>
				<!-- <div class="hover:bg-accent/20 flex place-items-center justify-between gap-4 rounded-lg border px-6 py-4 transition-all duration-200">
					<div>
						<div class="font-serif text-lg font-bold">{module.name}</div>
						<div class="font-serif text-muted-foreground">
							{module.syllabus.length} chapters
						</div>
					</div>
				</div> -->

				<div class="flex items-start justify-between gap-4">
					<div class="flex min-w-0 flex-col">
						<span class="text-xs text-muted-foreground">Module {roman(module.number)}</span>
						<h3 class="font-serif text-lg md:text-xl leading-snug">{module.name}</h3>
					</div>
					<span class="shrink-0 text-xs md:text-sm text-muted-foreground">
						{module.syllabus.length} chapter{module.syllabus.length === 1 ? "" : "s"}
					</span>
				</div>
				<div class="mt-2 text-sm text-muted-foreground line-clamp-2">
					{module.syllabus.join(", ")}
				</div>
				<!-- <div class="mt-3 text-sm text-foreground/70 transition-transform duration-300 group-hover:translate-x-0.5">
					View chapters <ArrowRightIcon class="inline-flex size-3" />
				</div> -->
			</a>
		{/each}
	</div>
</div>

{#if course.textbooks.length}
	<div class="space-y-4">
		<h2 class="text-xl font-semibold">Text Books</h2>
		<ol class="ml-6 list-outside list-decimal space-y-2">
			{#each course.textbooks as textbook}
				<li class="list-item">{textbook}</li>
			{/each}
		</ol>
	</div>
{/if}

{#if course.referenceBooks.length}
	<div class="space-y-4">
		<h2 class="text-xl font-semibold">Reference Books</h2>
		<ol class="ml-6 list-outside list-decimal space-y-2">
			{#each course.referenceBooks as reference}
				<li class="list-item">{reference}</li>
			{/each}
		</ol>
	</div>
{/if}

<!-- {#if course.nptelCourse}
	<div class="space-y-4">
		<FancyHeader class="font-serif text-2xl">NPTEL Course</FancyHeader>

		<div class="text-center">
			{#if "title" in course.nptelCourse && "url" in course.nptelCourse}
				<a
					class="text-primary font-medium underline underline-offset-4"
					href={course.nptelCourse.url}
				>{course.nptelCourse.title}</a>
			{:else if "title" in course.nptelCourse}
				{course.nptelCourse.title}
			{:else}
				<a
					class="text-primary font-medium underline underline-offset-4"
					href={course.nptelCourse.url}
				>{course.nptelCourse.url}</a>
			{/if}
		</div>
	</div>
{/if} -->

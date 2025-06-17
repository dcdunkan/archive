<script lang="ts">
	import FancyHeader from "$lib/components/fancy-header.svelte";
	import { Button } from "$lib/components/ui/button";
	import { roman } from "$lib/helpers";
	import { ArrowRightIcon } from "@lucide/svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let { course } = data;
</script>

<div class="text-center">
	<h1 class="font-serif text-xl">{course.code}</h1>
	<h1 class="font-serif text-4xl font-bold">{course.name}</h1>
</div>

{#if course.preamble && course.preamble.length}
	<div class="space-y-4">
		<FancyHeader class="font-serif text-2xl">Preamble</FancyHeader>
		<div class="text-justify">{course.preamble}</div>
	</div>
{/if}

<div class="space-y-4">
	<span class="flex items-center">
		<span class="h-px flex-1 bg-gray-300"></span>
		<span class="shrink-0 px-4 font-serif text-2xl">Modules</span>
		<span class="h-px flex-1 bg-gray-300"></span>
	</span>

	<div class="flex flex-col space-y-4">
		{#each course.modules as module, i}
			<div class="hover:bg-accent/20 flex place-items-center justify-between gap-4 rounded-lg border px-6 py-4 transition-all duration-200">
				<div>
					<div class="font-serif text-lg">
						{roman(module.number)}
					</div>
					<div class="font-serif text-2xl">{module.name}</div>
				</div>
				<Button
					variant="outline"
					class="aspect-square size-10"
					href="/courses/{course.code}/{module.number}-{module.slug}"
				>
					<ArrowRightIcon />
				</Button>
			</div>
		{/each}
	</div>

	<!-- <div class="flex flex-col space-y-4">
		{#each course.modules as module, i}
			<div
				tabindex="0"
				role="button"
				onclick={(e) => {
					const el = e.currentTarget.children.item(1) as HTMLDivElement;
					console.log(Number(el.style.maxHeight.replace(/[^0-9]+/g, "")));
					if (Number(el.style.maxHeight.replace(/[^0-9]+/g, "")) === 0) {
						el.style.maxHeight = el.scrollHeight + "px";
					} else {
						el.style.maxHeight = "0";
					}
				}}
				onkeydown={() => {}}
				class="hover:bg-accent/20 rounded-lg border p-4 text-center transition-all duration-200"
			>
				<div>
					<div class="font-serif text-2xl">{ROMAN[i]}</div>
					<div class="font-serif text-xl">{module.name}</div>
				</div>
				<div class="max-h-0 overflow-hidden text-left transition-all duration-300">
					<ul class="ml-4 list-outside list-disc p-4">
						{#each module.syllabus as s}
							<li class="list-item">{s}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div> -->
</div>

{#if course.textbooks.length}
	<div class="space-y-4">
		<span class="flex items-center">
			<span class="h-px flex-1 bg-gray-300"></span>
			<span class="shrink-0 px-4 font-serif text-2xl">Text Books</span>
			<span class="h-px flex-1 bg-gray-300"></span>
		</span>
		<ol class="ml-6 list-outside list-decimal space-y-2">
			{#each course.textbooks as textbook}
				<li class="list-item">{textbook}</li>
			{/each}
		</ol>
	</div>
{/if}

{#if course.referenceBooks.length}
	<div class="space-y-4">
		<span class="flex items-center">
			<span class="h-px flex-1 bg-gray-300"></span>
			<span class="shrink-0 px-4 font-serif text-2xl">Reference Books</span>
			<span class="h-px flex-1 bg-gray-300"></span>
		</span>
		<ol class="ml-6 list-outside list-decimal space-y-2">
			{#each course.referenceBooks as reference}
				<li class="list-item">{reference}</li>
			{/each}
		</ol>
	</div>
{/if}

{#if course.nptelCourse}
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
{/if}

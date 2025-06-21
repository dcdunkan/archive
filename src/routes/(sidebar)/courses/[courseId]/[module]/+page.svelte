<script lang="ts">
	import FancyHeader from "$lib/components/fancy-header.svelte";
	import { Button } from "$lib/components/ui/button";
	import { roman } from "$lib/helpers";
	import { BookOpenIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";
	import TocTree from "./toc-tree.svelte";

	let { data }: PageProps = $props();
	let { course, module } = data;

	import BiggerPicture from "bigger-picture";
	import mermaid from "mermaid";

	mermaid.initialize({
		startOnLoad: true,
		fontFamily: "Baskervville",
		theme: "neutral",
		flowchart: {
			curve: "linear",
		},
	});

	onMount(async () => {
		const bp = BiggerPicture({
			target: document.body,
		});
		const images = document.querySelectorAll("img");
		for (const image of images) {
			image.addEventListener("click", (e) => {
				if (e.currentTarget == null) return;
				bp.open({
					items: images,
					el: e.currentTarget,
				});
			});
		}

		const mermaidFences = document.querySelectorAll("code.language-mermaid");
		for (const [index, fence] of mermaidFences.entries()) {
			if (fence.parentElement?.tagName !== "PRE") continue;
			const content = fence.parentElement.innerText;
			const { svg, bindFunctions } = await mermaid.render(
				"mermaid-" + index,
				content,
			);

			const figure = document.createElement("figure");
			figure.insertAdjacentHTML("afterbegin", svg);

			const firstLine = content?.split("\n")?.[0];
			if (firstLine && firstLine.startsWith("%% ")) {
				const title = firstLine.slice(3);
				const figcaption = document.createElement("figcaption");
				figcaption.append(title);
				figure.append(figcaption);
			}

			bindFunctions?.(figure);
			fence.parentElement.replaceWith(figure);
		}

		/**
		 * NOTE: Figures are made from many sources.
		 *
		 * - Mermaid diagrams are manually set to figures.
		 * - Images from markdown are manually generated to figures.
		 *
		 * So, the figure numbers are generated after everything is loaded.
		 */
		const sections = document.querySelectorAll("#tap-markdown-preview div");
		for (const [sectionIndex, section] of sections.entries()) {
			for (
				const [figureIndex, figure] of section
					.querySelectorAll("figure").entries()
			) {
				let figcaption = figure.querySelector("figcaption");
				if (figcaption == null) {
					figcaption = document.createElement("figcaption");
					figure.append(figcaption);
				}
				const figureNumber = [
					module.number,
					sectionIndex + 1,
					figureIndex + 1,
				].join(".");
				const figureNumberElement = document.createElement("div");
				figureNumberElement.classList.add("md-figure-number");
				figureNumberElement.innerText = `Fig ${figureNumber}`;
				figcaption.prepend(figureNumberElement);
			}
		}
	});
</script>

<svelte:head>
	<title>{module.name} | {course.name}</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center space-y-8">
	<div class="space-y-2 text-center">
		<div class="font-serif text-xl">Module {roman(module.number)}</div>
		<div class="px-6 font-serif text-4xl font-bold">{module.name}</div>
		<!-- <div class="text-muted-foreground font-serif text-lg">{course.name}</div> -->
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
	</div>
</div>

<div class="snap-start scroll-mt-24 space-y-4" id="tap-table-of-contents">
	<FancyHeader class="font-serif text-2xl">Table of Contents</FancyHeader>
	<div class={"h-full overflow-hidden px-4 transition-[max-height] duration-500 ease-in-out will-change-[max-height]"}>
		<TocTree entries={module.hierarchy} />
	</div>
</div>

<div id="tap-markdown-preview" class="snap-y snap-start scroll-mt-24">
	{#each module.hierarchy as part}
		<div class="min-h-svh">
			{@html part.content}
		</div>
	{/each}
</div>

<!-- <div class="min-h-[25svh] snap-start space-y-4" id="tap-module-start"></div> -->

<div class="snap-start scroll-mt-24 space-y-4" id="tap-documents">
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

<div class="min-h-[50svh]"></div>

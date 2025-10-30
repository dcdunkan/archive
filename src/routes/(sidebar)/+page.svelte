<script lang="ts">
	import { pluralize } from "$lib/helpers";
	import { PackageIcon } from "@lucide/svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<div class="space-y-4">
	<div class="mt-2 flex place-items-center gap-4">
		<h1 class="font-serif text-4xl font-bold italic">The Archive Project</h1>
	</div>
	<p>
		The Archive Project aims to be a clean, centralized, and durable archive of academic resources for college
		students—gathered from scattered sources and reorganized for easier access, reading, and studying.
	</p>
</div>

<div class="space-y-4">
	<div class="mb-6 grid grid-cols-2 gap-2 divide-x-2">
		<div class="text-center">
			<div class="text-6xl font-black font-math">{data.courseCount}</div>
			<div>{pluralize(data.courseCount, "Course")}</div>
		</div>

		<div class="text-center">
			<div class="text-6xl font-black font-math">{data.moduleCount}</div>
			<div>{pluralize(data.moduleCount, "Module")}</div>
		</div>
	</div>
</div>

<div class="space-y-4">
	<span class="mb-4 flex items-center">
		<span class="shrink-0 pe-4 font-serif text-3xl font-medium">What This Is</span>
		<!-- <span class="h-px flex-1 bg-gray-300"></span> -->
	</span>

	<p>
		<i>The Archive Project</i> is a <b>no-nonsense, community-managed</b> platform that provides free and open
		courses and resources. The project aims to be a clean, centralized, and durable archive of academic resources
		for college students gathered from scattered sources by students and reorganized for easier access, reading, and
		studying.
	</p>

	<p>
		The project was started for digitalising scattered resources such as PDFs that are unorganized, mixed and
		duplicated, presentations, documents, YouTube videos and playlists, figures and question papers. The original
		aim was to enable full-text search on all the documents, for finding portions and related notes and questions
		easily. And more ideas were eventually built on to it.
	</p>

	<p>
		The focus is not just on storing documents, but on making them usable. Instead of flipping through a 60-page PDF
		or zooming into a blurry image, students can read portions in rich text, view as slides, bookmark sections, and
		generate flashcards or quizzes based on the material itself.
	</p>
</div>

<div class="space-y-4">
	<span class="mb-4 flex items-center">
		<span class="shrink-0 pe-4 font-serif text-3xl font-medium">What This Is Not</span>
		<!-- <span class="h-px flex-1 bg-gray-300"></span> -->
	</span>

	<p>
		This is not a social platform. There are no accounts, comments, feeds, or followers. It’s not a product,
		either—there are no ads, no analytics, and no "engagement features". This project does not care whether you use
		it or not.
	</p>

	<p>
		It is not trying to replace classes or teachers. It's a complement to the messy but valuable ecosystem of shared
		files that already exists—just with a better way to navigate and read them.
	</p>
</div>

<style>
	p {
		text-align: justify; /* todo: globalise justification */
	}
</style>

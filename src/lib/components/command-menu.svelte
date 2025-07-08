<script lang="ts">
	import { goto } from "$app/navigation";
	import * as Command from "$lib/components/ui/command/index";
	import type { LoadedData } from "$lib/types";
	import {
		BookAIcon,
		BookCopyIcon,
		ChevronRightIcon,
		FileQuestionIcon,
		FolderArchiveIcon,
		HashIcon,
		Icon,
		ImageIcon,
		MoonIcon,
		SunIcon,
		TableOfContentsIcon,
		TypeIcon,
	} from "@lucide/svelte";
	import { mode, toggleMode } from "mode-watcher";
	import { onDestroy, onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { fade } from "svelte/transition";
	import { z } from "zod/v4-mini";
	import { de } from "zod/v4/locales";

	// todo: move this to $lib

	export const courseSearchDocumentSchema = z.object({
		type: z.literal("course"),
		name: z.string(),
		code: z.string(),
		modules: z.number(),
	});

	export const moduleSearchDocumentSchema = z.object({
		type: z.literal("module"),
		name: z.string(),
		number: z.number(),
		slug: z.string(),
		courseCode: z.string(),
		courseName: z.string(),
	});

	export const chapterSearchDocumentSchema = z.object({
		type: z.literal("chapter"),
		title: z.string(),
		chapterId: z.string(),
		chapterNumber: z.number(),
		moduleName: z.string(),
		moduleNumber: z.number(),
		moduleSlug: z.string(),
		courseCode: z.string(),
		courseName: z.string(),
	});

	export const sectionSearchDocumentSchema = z.object({
		type: z.literal("section"),
		title: z.string(),
		sectionId: z.string(),
		parent: z.array(z.string()),
		level: z.number(),
		moduleName: z.string(),
		moduleNumber: z.number(),
		moduleSlug: z.string(),
		courseCode: z.string(),
		courseName: z.string(),
	});

	export const termSearchDocumentSchema = z.object({
		type: z.literal("term"),
	});

	export const figureSearchDocumentSchema = z.object({
		type: z.literal("figure"),
		figure_type: z.enum(["image", "diagram"]),
		src: z.string(),
		caption: z.string(),
		alt: z.string(),
	});

	export const questionSearchDocumentSchema = z.object({
		type: z.literal("question"),
	});

	export const searchDocumentSchema = z.discriminatedUnion("type", [
		courseSearchDocumentSchema,
		moduleSearchDocumentSchema,
		chapterSearchDocumentSchema,
		sectionSearchDocumentSchema,
		termSearchDocumentSchema,
		figureSearchDocumentSchema,
		questionSearchDocumentSchema,
	]);
	type SearchDocument = z.infer<typeof searchDocumentSchema>;

	let {
		open = $bindable(false),
	}: {
		open: boolean;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	let searchInput = $state("");
	let searchResults: LoadedData<SearchDocument[]> = $state({
		state: "resolved",
		data: [],
	});

	const MAX_RECENT_SEARCH_ENTRIES = 3; // todo: make this a setting
	const RECENT_SEARCHES_LOCAL_STORAGE_KEY = "__tap-recent_searches";
	let recentSearches: SearchDocument[] = $state([]);

	let abortController: AbortController | null = null;

	async function performSearch(query: string) {
		if (query == null || query.trim().length == 0) {
			searchResults = { state: "resolved", data: [] };
			return;
		}
		if (abortController != null) {
			abortController.abort();
		}
		abortController = new AbortController();
		try {
			searchResults = { state: "pending", message: "One moment..." };
			const response = await fetch(
				`/api/search?query=${encodeURIComponent(query)}`,
				{ signal: abortController.signal },
			);
			if (response.ok) {
				const { results } = await response.json() as {
					ok: true;
					results: SearchDocument[];
				};
				searchResults = { state: "resolved", data: results };
			} else if (response.status == 400) {
				// todo: abstract all of this into small validators (check if zod mini is actually really mini)
				const {
					message,
				} = await response.json() as { ok: false; message: string };
				searchResults = { state: "failed", message: message };
			}
		} catch (error) {
			if ((error as Error).name === "AbortError") {
				return;
			}
			searchResults = { state: "failed", message: "Something went wrong" };
		} finally {
			abortController = null;
		}
	}

	let debounceTimer: NodeJS.Timeout;

	function debouncedSearch(query: string) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			performSearch(query);
		}, 200);
	}

	$effect(() => {
		debouncedSearch(searchInput);
	});

	onMount(() => {
		const stored = localStorage.getItem(RECENT_SEARCHES_LOCAL_STORAGE_KEY);
		if (typeof stored !== "string" || stored.length === 0) return;
		try {
			const parsed = z.parse(z.array(searchDocumentSchema), JSON.parse(stored));
			recentSearches = parsed.slice(0, MAX_RECENT_SEARCH_ENTRIES);
		} catch (err) {
			localStorage.removeItem(RECENT_SEARCHES_LOCAL_STORAGE_KEY);
			return;
		}
	});

	$effect(() => {
		localStorage.setItem(RECENT_SEARCHES_LOCAL_STORAGE_KEY, JSON.stringify(recentSearches));
	});

	onDestroy(() => {
		clearTimeout(debounceTimer);
		if (abortController != null) {
			abortController.abort();
		}
	});

	const RESULT_TYPE_ICONS: Record<SearchDocument["type"], typeof Icon> = {
		course: FolderArchiveIcon,
		module: BookCopyIcon,
		chapter: TableOfContentsIcon,
		section: HashIcon,
		figure: ImageIcon,
		question: FileQuestionIcon, // todo: where are the normal question marks
		term: BookAIcon,
	};

	function getDetailsFromSearchResult(
		result: SearchDocument,
	): {
		value: string;
		title: string;
		crumbs: string[];
		path: string;
		anchor?: string;
	} {
		switch (result.type) {
			case "course":
				return {
					value: `course:${result.code}`,
					title: result.name,
					crumbs: [result.code],
					path: `/courses/${result.code}`,
				};
			case "module":
				return {
					value: `module:${result.courseCode}-${result.number}`,
					title: result.name,
					crumbs: [result.courseCode, result.courseName],
					path: `/courses/${result.courseCode}/${result.number}-${result.slug}`,
				};
			case "chapter":
				return {
					value: `chapter:${result.courseCode}-${result.moduleNumber}-${result.chapterNumber}`,
					title: result.title,
					crumbs: [result.courseCode, result.courseName],
					path: `/courses/${result.courseCode}/${result.moduleNumber}-${result.moduleSlug}`,
					anchor: result.chapterId,
				};
			case "section":
				return {
					value: `section:${result.courseCode}-${result.moduleNumber}-${result.sectionId}`,
					title: result.title,
					crumbs: [result.courseCode, result.courseName],
					path: `/courses/${result.courseCode}/${result.moduleNumber}-${result.moduleSlug}`,
					anchor: result.sectionId,
				};
			case "term":
			case "figure":
			case "question":
				throw new Error("not implemented: unexpected type of search result obtained");
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#snippet resultItem(result: SearchDocument)}
	{@const Icon = RESULT_TYPE_ICONS[result.type]}
	{@const details = getDetailsFromSearchResult(result)}
	<Command.Item
		value={details.value}
		onSelect={async () => {
			await goto(details.path);
			if (details.anchor != null) {
				document.getElementById(details.anchor)?.scrollIntoView({ block: "start" });
			}
			open = false;

			// add to recent searches
			const index = recentSearches.findIndex((recent) =>
				getDetailsFromSearchResult(recent).value === details.value
			);
			if (index !== -1) {
				recentSearches.splice(index, 1);
			}
			recentSearches.unshift(result);
		}}
	>
		<Icon class="mr-2 size-4" />
		<div class="truncate **:truncate">
			<div class="text-xs text-muted-foreground flex gap-1">
				{#each details.crumbs as crumb, i}
					<span>{crumb}</span>
					{#if i !== details.crumbs.length - 1}
						<ChevronRightIcon />
					{/if}
				{/each}
			</div>
			<div>{details.title}</div>
		</div>
	</Command.Item>
{/snippet}

<Command.Dialog bind:open shouldFilter={false}>
	<Command.Input placeholder="Search" bind:value={searchInput} />
	<Command.List>
		{#if searchInput.trim().length == 0}
			{#if recentSearches.length > 0}
				<Command.Group heading="Recent searches">
					{#each recentSearches.slice(0, MAX_RECENT_SEARCH_ENTRIES) as recentResult}
						{@render resultItem(recentResult)}
					{/each}
				</Command.Group>
			{/if}

			<Command.Group heading="Suggestions">
				<!-- todo: quick settings, include them in searches as well -->
				<Command.Item>
					<TypeIcon class="mr-2 size-4" />
					<span>Font & Display Settings</span>
				</Command.Item>
				<Command.Item onSelect={toggleMode}>
					<SunIcon class="mr-2 size-4 `scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon
						class="mr-2 size-4 absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
					/>
					<span>Switch to {mode.current === "dark" ? "light" : "dark"} mode</span>
				</Command.Item>
			</Command.Group>
		{:else}
			{#if searchResults.state === "pending"}
				<Command.Loading class="py-6 text-center text-sm">{searchResults.message}</Command.Loading>
			{:else if searchResults.state === "resolved"}
				{@const results = searchResults.data}
				<Command.Group>
					{#each results as result}
						{@render resultItem(result)}
					{/each}
				</Command.Group>
			{:else if searchResults.state === "failed"}
				<Command.Loading class="py-6 text-center text-sm">{searchResults.message}</Command.Loading>
			{/if}
		{/if}
	</Command.List>
</Command.Dialog>

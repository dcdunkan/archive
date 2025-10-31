<script lang="ts">
	import { goto } from "$app/navigation";
	import { PUBLIC_SEARCH_API_ROOT } from "$env/static/public";
	import * as Command from "$lib/components/ui/command/index";
	import type { LoadedData } from "$lib/types";
	import {
		BookCopyIcon,
		ChevronRightIcon,
		FolderArchiveIcon,
		HashIcon,
		Icon,
		MoonIcon,
		SunIcon,
		TableOfContentsIcon,
		TypeIcon,
	} from "@lucide/svelte";
	import { mode, toggleMode } from "mode-watcher";
	import { onDestroy, onMount } from "svelte";
	import { z } from "zod/v4-mini";

	// todo: move this to $lib

	export const baseSearchDocumentSchema = z.object({
		id: z.string(),
		// type: z.enum(["course", "module", "chapter", "section"]),
		title: z.string(),
	});
	export const courseSearchDocumentSchema = z.extend(baseSearchDocumentSchema, {
		type: z.literal("course"),
		context: z.object({
			courseCode: z.string(),
			courseName: z.string(),
		}),
	});

	export const moduleSearchDocumentSchema = z.extend(baseSearchDocumentSchema, {
		type: z.literal("module"),
		context: z.object({
			courseCode: z.string(),
			courseName: z.string(),

			moduleNumber: z.int(),
			moduleSlug: z.string(),
			moduleName: z.string(),
		}),
	});

	export const chapterSearchDocumentSchema = z.extend(baseSearchDocumentSchema, {
		type: z.literal("chapter"),
		context: z.object({
			courseCode: z.string(),
			courseName: z.string(),

			moduleNumber: z.int(),
			moduleSlug: z.string(),
			moduleName: z.string(),

			chapterNumber: z.int(),
			chapterSlug: z.string(),
			chapterName: z.string(),
		}),
	});

	export const sectionSearchDocumentSchema = z.extend(baseSearchDocumentSchema, {
		type: z.literal("section"),
		context: z.object({
			courseCode: z.string(),
			courseName: z.string(),

			moduleNumber: z.int(),
			moduleSlug: z.string(),
			moduleName: z.string(),

			chapterNumber: z.int(),
			chapterSlug: z.string(),
			chapterName: z.string(),

			sectionParent: z.array(z.string()),
			sectionSlug: z.string(),
		}),
	});

	export const searchDocumentSchema = z.discriminatedUnion("type", [
		courseSearchDocumentSchema,
		moduleSearchDocumentSchema,
		chapterSearchDocumentSchema,
		sectionSearchDocumentSchema,
	]);
	type SearchDocument = z.infer<typeof searchDocumentSchema>;

	let {
		open = $bindable(false),
	}: {
		open: boolean;
	} = $props();

	let searchInputEl = $state<HTMLInputElement | null>(null);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	$effect(() => {
		if (!open) return;
		searchInputEl?.select();
	});

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
				`${PUBLIC_SEARCH_API_ROOT}/search?query=${encodeURIComponent(query)}`,
				{
					cache: "default",
					signal: abortController.signal,
				},
			);
			if (response.ok) {
				const results = await response.json() as SearchDocument[];
				searchResults = { state: "resolved", data: results };
			} else if (response.status == 400) {
				searchResults = { state: "failed", message: "Invalid query" };
			} else {
				searchResults = { state: "failed", message: "Something went wrong." };
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
	};

	function getDetailsFromSearchResult(
		{ type, id, title, context }: SearchDocument,
	): {
		value: string;
		title: string;
		crumbs: string[];
		path: string;
		anchor?: string;
	} {
		switch (type) {
			case "course":
				return {
					value: id,
					title: title,
					crumbs: [context.courseCode],
					path: `/courses/${context.courseCode}`,
				};
			case "module":
				return {
					value: id,
					title: title,
					crumbs: [context.courseCode, context.courseName],
					path: `/courses/${context.courseCode}/${context.moduleSlug}`,
				};
			case "chapter":
				return {
					value: id,
					title: title,
					crumbs: [context.courseCode, context.moduleName],
					path: `/courses/${context.courseCode}/${context.moduleSlug}/${context.chapterSlug}`,
				};
			case "section":
				return {
					value: id,
					title: title,
					crumbs: [context.courseCode, context.chapterName],
					path: `/courses/${context.courseCode}/${context.moduleSlug}/${context.chapterSlug}`,
					anchor: context.sectionSlug,
				};
			default:
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
	<Command.Input placeholder="Search" bind:value={searchInput} bind:ref={searchInputEl} />
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

<script lang="ts">
	import { page } from "$app/state";
	import { navigating } from "$app/stores";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import CommandMenu from "$lib/components/command-menu.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { FullscreenIcon, MoonIcon, SearchIcon, SunIcon } from "@lucide/svelte";
	import { toggleMode } from "mode-watcher";
	import { cubicOut } from "svelte/easing";
	import { Tween } from "svelte/motion";

	let { children } = $props();

	function queryFullScreen() {
		return typeof matchMedia === "function" && matchMedia("(display-mode: fullscreen)").matches;
	}
	let isFullScreen = $state(queryFullScreen());

	$effect(() => {
		const setFullScreen = () => (isFullScreen = document.fullscreenElement != null || queryFullScreen());
		document.addEventListener("fullscreenchange", setFullScreen);
		document.onkeyup = (event) => {
			if (event.key === "F11") setFullScreen();
		};
	});

	let openSearchMenu = $state(false);

	const width = new Tween(0, { duration: 300, easing: cubicOut });
	const height = new Tween(0, { duration: 10, easing: cubicOut });

	$effect(() => {
		if ($navigating) {
			height.set(3);
			width.set(Math.random() * 20 + 50);
		} else {
			width.set(100);
			setTimeout(() => height.set(0), 200);
		}
	});
</script>

<Sidebar.Provider>
	<AppSidebar />

	<Sidebar.Inset>
		<main class="w-full">
			<nav class="bg-background/50 sticky top-0 z-20 flex place-items-center gap-4 border-b p-3 backdrop-blur-lg">
				<div
					style="height: {height.current}px; width: {width.current}%;"
					class="absolute bottom-0 left-0 bg-primary w-0 transition-all duration-150 ease-out"
				></div>

				<Sidebar.Trigger class="size-10" />
				<h1 class="grow truncate font-medium">{page.data.title}</h1>
				<div class="space-x-1">
					<Button
						variant="ghost"
						onclick={async () => {
							if (!isFullScreen) {
								await document.documentElement.requestFullscreen();
							} else if (document.fullscreenElement) {
								await document.exitFullscreen();
							} else {
								alert("Press F11 to exit full screen");
							}
						}}
					>
						<FullscreenIcon />
					</Button>

					<Button onclick={toggleMode} variant="ghost" size="icon">
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>

					<Button
						variant="ghost"
						onclick={() => openSearchMenu = !openSearchMenu}
					><SearchIcon /></Button>
				</div>
			</nav>
			<div class="mx-auto flex max-w-2xl flex-col">
				<div class="p-6">
					<div class="snap-y space-y-8">
						{@render children()}
					</div>
				</div>
			</div>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

<CommandMenu bind:open={openSearchMenu} />

<div class="min-h-[50svh]"></div>

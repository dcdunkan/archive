<script lang="ts">
	import { page } from "$app/state";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { FullscreenIcon, MoonIcon, SearchIcon, SunIcon } from "@lucide/svelte";
	import { toggleMode } from "mode-watcher";

	let { children } = $props();

	function queryFullScreen() {
		return typeof matchMedia === "function"
			&& matchMedia("(display-mode: fullscreen)").matches;
	}
	let isFullScreen = $state(queryFullScreen());

	$effect(() => {
		const setFullScreen =
			() => (isFullScreen = document.fullscreenElement != null || queryFullScreen());
		document.addEventListener("fullscreenchange", setFullScreen);
		document.onkeyup = (event) => {
			if (event.key === "F11") setFullScreen();
		};
	});
</script>

<Sidebar.Provider>
	<AppSidebar />

	<Sidebar.Inset>
		<main class="w-full">
			<nav class="bg-background/50 sticky top-0 z-20 flex place-items-center gap-4 border-b p-3 backdrop-blur-lg">
				<Sidebar.Trigger class="size-10" />
				<h1 class="grow truncate font-medium">{page.data.title}</h1>
				<div class="space-x-1">
					<Button
						variant="ghost"
						onclick={async () => {
							if (!isFullScreen) {
								await document.documentElement
									.requestFullscreen();
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

					<Button variant="ghost"><SearchIcon /></Button>
				</div>
			</nav>
			<div class="mx-auto flex max-w-screen-lg flex-col">
				<div class="p-6">
					<div class="snap-y space-y-8">
						{@render children()}
					</div>
				</div>
			</div>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

<script lang="ts">
	import { cn } from "$lib/shadcn-utils";
	import type { Snippet } from "svelte";

	let {
		children,
		class: className,
		animate = false,
		open = $bindable(true),
		grayify = true,
	}: {
		children: Snippet;
		class?: string;
		animate?: boolean;
		open?: boolean;
		grayify?: boolean;
	} = $props();
</script>

<span class="flex items-center transition-all duration-500 ease-in-out select-none">
	<span
		class={cn(
			"bg-foreground h-px flex-1 transition-all duration-500",
			open ? "max-w-full" : animate && "max-w-0",
		)}
	></span>
	<span
		class={cn(
			"text-foreground shrink-0 px-4 transition-[color] duration-500 ease-in-out",
			animate && !open && grayify && "text-muted-foreground",
			className,
		)}
		role="button"
		onclick={(e) => {
			if (!animate) return;
			open = !open;
			e.currentTarget.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}}
		onkeydown={() => {}}
		tabindex="-1"
	>
		{@render children()}
	</span>
	<span
		class={cn(
			"bg-foreground h-px flex-1 transition-[background-color] duration-500 ease-in-out",
			animate && !open && grayify && "bg-muted-foreground",
		)}
	></span>
</span>

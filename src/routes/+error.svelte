<script lang="ts">
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { HomeIcon } from "@lucide/svelte";
</script>

<div class="flex h-screen w-full items-center justify-center border p-4">
	<div class="text-center">
		<div class="text-7xl font-black">
			{page.status}
		</div>
		<div class="font-serif text-xl">{page.error?.message}</div>
		<Button variant="outline" class="mt-6" href="/"><HomeIcon />Go Home</Button>
	</div>
</div>

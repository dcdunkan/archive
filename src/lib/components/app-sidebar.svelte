<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import HouseIcon from "@lucide/svelte/icons/house";
	import InboxIcon from "@lucide/svelte/icons/inbox";
	import SearchIcon from "@lucide/svelte/icons/search";
	import SettingsIcon from "@lucide/svelte/icons/settings";

	// Menu items.
	const items = [
		{
			title: "Home",
			url: "/",
			icon: HouseIcon,
		},
		{
			title: "Courses",
			url: "/courses",
			icon: InboxIcon,
		},
		{
			title: "Documents",
			url: "/documents",
			icon: CalendarIcon,
		},
		{
			title: "Search",
			url: "#",
			icon: SearchIcon,
		},
		{
			title: "Settings",
			url: "#",
			icon: SettingsIcon,
		},
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Archive</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

import { SEARCH_API_ROOT } from "$env/static/private";
import { json } from "@sveltejs/kit";

export const GET = async ({ url, fetch }) => {
	const query = url.searchParams.get("query");
	if (typeof query !== "string" || query.trim().length == 0) {
		return json({
			ok: false,
			message: "Invalid query string",
		}, { status: 400 });
	}

	const apiUrl = new URL(SEARCH_API_ROOT + "/search");
	apiUrl.searchParams.set("query", query);

	const response = await fetch(apiUrl, { cache: "no-cache" });
	if (response.ok) {
		return json({
			ok: true,
			results: await response.json(),
		});
	} else {
		return json({
			ok: false,
			message: "Could not get search results",
		});
	}
};

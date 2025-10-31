import { PUBLIC_CONTENT_API_ROOT } from "$env/static/public";
import ky from "ky";

export const api = ky.create({
	prefixUrl: PUBLIC_CONTENT_API_ROOT,
	headers: {
		Accept: "application/json",
	},
	throwHttpErrors: true,
});

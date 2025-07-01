import { CONTENT_API_ROOT } from "$env/static/private";
import ky from "ky";

export const api = ky.create({
	prefixUrl: CONTENT_API_ROOT,
	headers: {
		Accept: "application/json",
	},
	throwHttpErrors: true,
});

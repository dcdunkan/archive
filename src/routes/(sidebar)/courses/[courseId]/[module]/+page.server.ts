import { CONTENT_API_ROOT } from "$env/static/private";
import { api } from "$lib/server/content-api";
import { headingSlugger, mdit } from "$lib/server/markdown";
import type { Course, Module } from "$lib/types";
import { error } from "@sveltejs/kit";
import urlJoin from "proper-url-join";
import type { PageServerLoad } from "./$types";

// todo: add +error.svelte to more routes
// todo: check responses in api GETs and show 404 and such things

export const load: PageServerLoad = async ({ params }) => {
	const courseCode = params.courseId.toLowerCase();
	const course = await api.get(`course/${courseCode}.json`).json<Course>();

	const moduleNumber = Number(params.module);
	const moduleInfo = isNaN(moduleNumber)
		? course.modules.find((module) => module.slug === params.module)
			?? course.modules.find((module) => params.module === `${module.number}-${module.slug}`)
		: course.modules.find((module) => module.number === moduleNumber);

	if (moduleInfo == null) {
		return error(404, "Module not found");
	}

	// render the markdown content
	headingSlugger.reset();

	// todo: find another better way
	const IMAGE_PREFIX = urlJoin(
		CONTENT_API_ROOT,
		`course/${courseCode}/module/${moduleInfo.number}`,
		{ trailingSlash: false },
	);

	mdit.renderer.rules.image = function(tokens, idx) {
		const token = tokens[idx];
		const src = token.attrGet("src");
		const alt = token.content;
		const title = token.attrGet("title");

		return [
			`<figure>`,
			[
				`<img`,
				`src="${IMAGE_PREFIX}/${src}"`,
				`alt="${alt}"`,
				`loading="lazy"`,
				`decoding="async"`,
				title ? `data-caption="${mdit.utils.escapeHtml(title)}"` : "",
				`/>`,
			].join(" "),
			...(title ? [`<figcaption>${title}</figcaption>`] : []),
			`</figure>`,
		].join("");
	};

	const module = await api.get(`course/${courseCode}/module/${moduleInfo.number}.json`)
		.json<Module>()
		.then((module) => ({
			...module,
			parts: module.parts.map((part) => mdit.render(part)),
		}));

	return {
		title: course.name,
		course: course,
		module: module,
	};
};

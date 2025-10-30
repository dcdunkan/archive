import { api } from "$lib/server/content-api";
import type { Course, Module } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// todo: add +error.svelte to more routes
// todo: check responses in api GETs and show 404 and such things

export const load: PageServerLoad = async ({ params }) => {
	const courseCode = params.courseCode;
	const course = await api.get(`courses/${courseCode}.json`).json<Course>();

	const moduleInfo = course.modules.find((module) => module.slug === params.moduleSlug);
	if (moduleInfo == null) {
		return error(404, "Module not found");
	}

	const module = await api
		.get(`courses/${courseCode}/modules/${moduleInfo.number}.json`)
		.json<Module>();

	return {
		title: course.name,
		course: course,
		module: module,
	};
};

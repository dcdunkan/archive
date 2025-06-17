import { getCourses } from "$lib/server/content";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const courses = await getCourses();

	const course = courses.get(params.courseId.toLowerCase());

	if (course == null) {
		// todo: add +error.svelte for this subroute
		error(404, "Course not found");
	}

	const modNumber = Number(params.module);
	const module = isNaN(modNumber)
		? course.modules.find((module) => module.slug === params.module)
			?? course.modules.find((module) => params.module === `${module.number}-${module.slug}`)
		: course.modules.find((module) => module.number === modNumber);

	if (module == null) {
		return error(404, "Module not found");
	}

	return {
		title: course.name,
		course: course,
		module: module,
	};
};

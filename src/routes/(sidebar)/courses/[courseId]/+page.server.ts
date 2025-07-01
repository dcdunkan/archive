import { api } from "$lib/server/content-api";
import type { Course } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const courseCode = params.courseId.toLowerCase();
	const course = await api.get(`course/${courseCode}.json`).json<Course>();

	if (course == null) {
		// todo: add +error.svelte for this subroute
		error(404, "Course not found");
	}

	return {
		title: course.name,
		course: course,
	};
};

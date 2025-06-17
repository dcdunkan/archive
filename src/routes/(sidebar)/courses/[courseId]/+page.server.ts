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

	return {
		title: course.name,
		course: course,
	};
};

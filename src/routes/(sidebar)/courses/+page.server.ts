import { getCourses } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const courses = await getCourses();
	return {
		title: "Courses",
		courses: Array.from(courses.values()),
	};
};

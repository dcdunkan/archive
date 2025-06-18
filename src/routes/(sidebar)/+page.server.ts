import { getCourses } from "$lib/server/content";
import type { PageServerLoad } from "./(homepage)/$types";

export const load: PageServerLoad = async () => {
	const courses = await getCourses();

	let moduleCount = 0;
	courses.forEach((course) => {
		moduleCount += course.modules.length;
	});

	return {
		title: "Home",
		courseCount: courses.size,
		moduleCount: moduleCount,
	};
};

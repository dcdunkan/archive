import { api } from "$lib/server/content-api";
import type { Courses } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const courses = await api.get("courses.json").json<Courses>();

	let moduleCount = 0;
	courses.forEach((course) => {
		moduleCount += course.modules.length;
	});

	return {
		title: "Home",
		courseCount: courses.length,
		moduleCount: moduleCount,
	};
};

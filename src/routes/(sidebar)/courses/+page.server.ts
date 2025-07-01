import { api } from "$lib/server/content-api";
import type { Courses } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const courses = await api.get("courses.json").json<Courses>();
	return {
		title: "Courses",
		courses: courses, // todo: parallel loading and waterfalls
	};
};

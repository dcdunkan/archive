import { api } from "$lib/server/content-api";
import type { Course, Module, ModuleChapter } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// todo: add +error.svelte to more routes
// todo: check responses in api GETs and show 404 and such things

export const load: PageServerLoad = async ({ params }) => {
	const courseCode = params.courseCode;
	const course = await api.get(`courses/${courseCode}.json`).json<Course>();

	// todo: short link resolver needs to be a middleware. (ie, link.com/courseid/modulenumber/chapternumber)
	// const moduleInfo = isNaN(moduleNumber)
	// 		? course.modules.find((module) => module.slug === params.module)
	// 			?? course.modules.find((module) => params.module === `${module.number}-${module.slug}`)
	// 		: course.modules.find((module) => module.number === moduleNumber);

	const moduleInfo = course.modules.find((module) => module.slug === params.moduleSlug);
	if (moduleInfo == null) {
		return error(404, "Module not found");
	}

	const module = await api
		.get(`courses/${courseCode}/modules/${moduleInfo.number}.json`)
		.json<Module>();

	const chapterIndex = module.chapters.findIndex((chapter) => chapter.slug === params.chapterSlug);
	if (chapterIndex == -1) {
		return error(404, "Chapter not found"); // todo: related chapters, or back to module
	}

	const chapterInfo = module.chapters[chapterIndex];
	const chapter = await api
		.get(`courses/${courseCode}/modules/${moduleInfo.number}/chapters/${chapterInfo.number}.html.json`)
		.json<ModuleChapter>();

	// console.log(render(TestComp));

	return {
		title: course.name,
		course: course,
		module: module,
		chapter: chapter,
		previousChapter: chapterIndex - 1 < 0
			? null
			: relevantChapterInfo(module.chapters[chapterIndex - 1]),
		nextChapter: chapterIndex + 1 >= module.chapters.length
			? null
			: relevantChapterInfo(module.chapters[chapterIndex + 1]),
	};
};

function relevantChapterInfo(chapter: Omit<ModuleChapter, "content">) {
	return {
		title: chapter.title,
		slug: chapter.slug,
		number: chapter.number,
	};
}

import type { z } from "zod/v4";
import type { COURSE_SCHEMA, MODULE_SCHEMA } from "./server/content";

type CourseData = z.infer<typeof COURSE_SCHEMA>;
export type ModuleData = z.infer<typeof MODULE_SCHEMA>;

export type TOCItem = {
	id: string; // slugged id
	level: number;
	title: string;
	children: TOCItem[];
};

export type Hierarchy = (TOCItem & { content: string })[];

export type Module = ModuleData & {
	path: string;
	slug: string;
	number: number;
	hierarchy: Hierarchy;
};

export type Course = CourseData & {
	path: string;
	modules: Module[];
};

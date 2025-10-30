export type Courses = {
	code: string;
	name: string;
	description: string;
	modules: {
		number: number;
		name: string;
		slug: string;
	}[];
}[];

export type Course = {
	code: string;
	name: string;
	description: string;
	preamble: string;
	textbooks: string[];
	referenceBooks: string[];
	modules: {
		number: number;
		name: string;
		slug: string;
		syllabus: string[];
	}[];
};

export type HeadingItem = {
	slug: string;
	title: string;
	depth: number;
	children: HeadingItem[];
};

export type ModuleChapter = {
	number: number;
	title: string;
	slug: string;
	structure: HeadingItem[];
	content: string; // html content
	// content: Mdast.Root; todo: fix up mdast
};

export type Module = {
	number: number;
	name: string;
	syllabus: string[];
	slug: string;
	chapters: {
		number: number;
		title: string;
		slug: string;
		structure: HeadingItem[];
	}[];
};

export type LoadedSuccess<T> = { state: "resolved"; data: T };
export type LoadedPending = { state: "pending"; message: string };
export type LoadedFailure = { state: "failed"; message: string };
export type LoadedData<T> = LoadedSuccess<T> | LoadedPending | LoadedFailure;

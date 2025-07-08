export type Courses = {
	code: string;
	name: string;
	modules: {
		number: number;
		name: string;
		slug: string;
	}[];
}[];

export type Course = {
	code: string;
	name: string;
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

export type TOCItem = {
	id: string; // slugged id
	level: number;
	title: string;
	children: TOCItem[];
};

export type Module = {
	number: number;
	name: string;
	syllabus: string[];
	slug: string;
	hierarchy: TOCItem[];
	parts: string[];
};

export type LoadedSuccess<T> = { state: "resolved"; data: T };
export type LoadedPending = { state: "pending"; message: string };
export type LoadedFailure = { state: "failed"; message: string };
export type LoadedData<T> = LoadedSuccess<T> | LoadedPending | LoadedFailure;

import { default as markdownItKatexPlugin } from "$lib/markdown-it-katex";
import type { Course, Hierarchy, Module, TOCItem } from "$lib/types";
import { parse as parseYaml } from "@std/yaml";
import GithubSlugger from "github-slugger";
import MarkdownIt from "markdown-it";
import markdownItAnchorPlugin from "markdown-it-anchor";
import { markdownItFancyListPlugin } from "markdown-it-fancy-lists";
import type { Token } from "markdown-it/index.js";
import fs from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import slugify from "slugify";
import { z } from "zod/v4";

const DATA_DIR = "./data";
const MAX_TOC_DEPTH = 3;
const STATIC_DIR = "./static";

export const COURSE_SCHEMA = z.object({
	code: z.string().nonempty(),
	name: z
		.string()
		.nonempty()
		.refine((arg) => isNaN(Number(arg))),
	preamble: z.string(),
	textbooks: z.array(z.string()),
	referenceBooks: z.array(z.string()),
	nptelCourse: z
		.union([
			z.object({ title: z.string().nonempty(), url: z.url() }),
			z.object({ title: z.string().nonempty() }),
			z.object({ url: z.url() }),
		])
		.optional(),
});

export const MODULE_SCHEMA = z.object({
	number: z.int(),
	name: z.string(),
	syllabus: z.array(z.string()).default([]),
	parts: z.array(z.string()).default([]),
});

async function resolveCourseDirectory(entry: fs.Dirent<string>): Promise<Course> {
	const coursePath = join(entry.parentPath, entry.name);

	const metadata = await fs.promises
		.readFile(join(coursePath, "course.yaml"), "utf8")
		.then((content) => z.parse(COURSE_SCHEMA, parseYaml(content)));

	const moduleDirs = await fs.promises
		.readdir(coursePath, { withFileTypes: true })
		.then((files) => files.filter((file) => file.isDirectory()).map((file) => file.name));

	const modules: Module[] = [];
	const slugger = new GithubSlugger();
	const mdit = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: true,
	})
		.use(markdownItAnchorPlugin, {
			slugify: (str) => slugger.slug(str, false),
			permalink: markdownItAnchorPlugin.permalink
				.headerLink({ symbol: "#" }),
		})
		.use(markdownItKatexPlugin)
		.use(markdownItFancyListPlugin, {});

	const usedImages = new Set<string>();

	for (const moduleDir of moduleDirs) {
		const modulePath = join(coursePath, moduleDir);

		mdit.renderer.rules.image = function(tokens, idx) {
			const token = tokens[idx];
			const src = moduleDir + "/" + token.attrGet("src");
			const alt = token.content;
			const title = token.attrGet("title");

			// todo: make this shit better
			return `<figure>
			<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${
				title ? ` data-caption=${title}` : ""
			}>${title ? `<figcaption>${title}</figcaption>` : ""}</figure>`;
		};

		const metadata = await fs.promises
			.readFile(join(modulePath, "module.yaml"), "utf8")
			.then((content) => z.parse(MODULE_SCHEMA, parseYaml(content)));

		const hierarchy: Hierarchy = [];

		for (const filename of metadata.parts) {
			slugger.reset(); // reset each time

			const fileContent = await fs.promises
				.readFile(join(modulePath, filename), "utf8");

			const tokens = mdit.parse(fileContent.trim(), {});
			const fileToc = getMarkdownToc(tokens);
			if (fileToc.length !== 1 || fileToc[0].level !== 1) {
				throw new Error("Module part should have the the part name as H1 and only one H1");
			}

			// manage content and toc
			hierarchy.push({
				...fileToc[0],
				content: mdit.renderer.render(tokens, mdit.options, {}), // to prevent the slug re-occurrence
			});

			// manage images
			const images = tokens.filter(token => token.type === "inline")
				.flatMap(token => token.children || [])
				.filter(child => child.type === "image")
				.map((image) => image.attrGet("src"))
				.filter((src) => src != null)
				.filter((src) => src.length > 0 && !URL.canParse(src))
				.map((src) => resolve(modulePath, src));

			for (const image of images) {
				usedImages.add(image);
			}
		}

		modules.push({
			number: metadata.number,
			name: metadata.name,
			syllabus: metadata.syllabus,
			parts: metadata.parts,
			hierarchy: hierarchy,
			path: modulePath,
			slug: slugify(metadata.name, {
				lower: true,
				replacement: "-",
				trim: true,
				strict: true,
			}),
		});
	}

	// copy source images to static directory
	await fs.promises.rm(join(STATIC_DIR, "courses"), { recursive: true, force: true });
	for (const filepath of usedImages) {
		const relativePath = relative(resolve(DATA_DIR), filepath);
		const sourceDir = dirname(relativePath);
		const destinationDir = join(STATIC_DIR, sourceDir);
		await fs.promises.mkdir(destinationDir, { recursive: true });
		await fs.promises.copyFile(filepath, join(destinationDir, basename(relativePath)));
	}

	return {
		code: metadata.code,
		name: metadata.name,
		preamble: metadata.preamble,
		textbooks: metadata.textbooks,
		referenceBooks: metadata.referenceBooks,
		nptelCourse: metadata.nptelCourse,

		path: coursePath,
		modules: modules,
	};
}

function getMarkdownToc(tokens: Token[]) {
	const root: TOCItem[] = [];
	const stack: TOCItem[][] = [root];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.type === "heading_open") {
			const level = Number(token.tag[1]);
			if (level <= MAX_TOC_DEPTH) {
				const anchorToken = tokens[i + 1];
				if (
					anchorToken.children == null
					|| anchorToken.children[0]?.type !== "link_open"
				) {
					throw new Error("Invalid");
				}
				const inlineToken = tokens[i + 1].children![1];
				const title = inlineToken.type === "text" ? inlineToken.content : "";
				const id = token.attrGet("id");
				if (id == null) {
					throw new Error("invalid id");
				}
				const entry: TOCItem = {
					id: id,
					level: level,
					title: title,
					children: [],
				};
				if (!stack[level - 1]) {
					stack[level - 1] = root;
				}
				stack[level - 1].push(entry);
				stack[level] = entry.children;
			}
		}
	}
	return root;
}

export async function getCourses() {
	const courseDirs = await fs.promises
		.readdir(resolve(DATA_DIR, "courses"), { withFileTypes: true });

	const courses = new Map<string, Course>();

	for (const courseDir of courseDirs) {
		if (!courseDir.isDirectory()) continue;

		const course = await resolveCourseDirectory(courseDir);
		courses.set(course.code.toLowerCase(), course);
	}

	return courses;
}

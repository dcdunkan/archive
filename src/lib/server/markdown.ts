import { markdownItFancyListPlugin } from "$lib/markdown-it-plugins/fancy-lists";
import { markdownItKatexPlugin } from "$lib/markdown-it-plugins/katex";
import GithubSlugger from "github-slugger";
import MarkdownIt from "markdown-it";
import markdownItAnchorPlugin from "markdown-it-anchor";

export const headingSlugger = new GithubSlugger();
export const mdit = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
})
	.use(markdownItAnchorPlugin, {
		slugify: (str) => headingSlugger.slug(str, false),
		permalink: markdownItAnchorPlugin.permalink.headerLink({}),
	})
	.use(markdownItKatexPlugin)
	.use(markdownItFancyListPlugin, {});

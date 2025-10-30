import "unified";
import "mdast-util-math";
import * as Mdast from "mdast";

// === UNIFIED STUFF
export interface Figure extends Mdast.Node {
	type: "figure";
	caption: string;
	number: number;
	child: Mdast.Image | D2Node;
}

export interface D2Node extends Mdast.Node {
	type: "d2";
	meta: string | null | undefined;
	diagram: {
		type: "source";
		value: string;
	} | {
		type: "svg";
		hash: string;
		width: number;
		height: number;
		raw: string;
	};
}

declare module "mdast" {
	interface HeadingData {
		id: string;
	}

	interface ImageData {
		height: number;
		width: number;
		size: number;
	}

	interface RootContentMap {
		figure: Figure;
	}
}

declare module "mdast-util-math" {
	interface Math {
		renderedString: string;
	}

	interface InlineMath {
		renderedString: string;
	}
}

declare module "unified" {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface Data {
	}
}

export {};

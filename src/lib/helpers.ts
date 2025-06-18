// this is more than enough for now
const ROMAN_NUMERALS: Record<number, string> = {
	1: "I",
	2: "II",
	3: "III",
	4: "IV",
	5: "V",
	6: "VI",
	7: "VII",
	8: "VIII",
	9: "IX",
	10: "X",
};
export function roman(num: number) {
	return ROMAN_NUMERALS[num] ?? num;
}

// only cares about english
export function pluralize(count: number, singular: string): string;
export function pluralize(count: number, singular: string, plural: string): string;
export function pluralize(count: number, singular: string, plural?: string): string {
	if (plural == null) plural = singular + "s";
	return count === 1 ? singular : plural;
}

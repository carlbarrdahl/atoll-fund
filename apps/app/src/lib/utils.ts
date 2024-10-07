import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(markdown?: string) {
  // Regex patterns to match different Markdown syntax
  const headerRegex = /^#{1,6}\s+/gm; // Matches headers starting with #
  const otherMarkdownRegex =
    /(\*\*|__|[*_~`]|!?\[.*?\]\(.*?\)|<.*?>|`{3}[\s\S]*?`{3}|`{1}[\s\S]*?`{1}|[-+*]\s+|>\s+|\d+\.\s+|\n|\r|\t)/g;

  // Replace headers and other markdown patterns with an empty string
  let plainText = markdown?.replace(headerRegex, "");
  plainText = plainText?.replace(otherMarkdownRegex, "").trim();

  return plainText ?? "";
}

export const truncate = (str = "", max = 20, sep = "...") => {
  const len = str.length;
  if (len > max) {
    const seplen = sep.length;

    if (seplen > max) {
      return str.substr(len - max);
    }

    const n = -0.5 * (max - len - seplen);

    const center = len / 2;

    const front = str.substr(0, center - n);
    const back = str.substr(len - center + n); // without second arg, will automatically go to end of line.

    return front + sep + back;
  }

  return str;
};

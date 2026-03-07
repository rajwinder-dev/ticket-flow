import { format, isValid, parseISO } from "date-fns";

export function formatCamelCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first character
    .replace(/ (\w)/g, (_, c) => ` ${c.toUpperCase()}`); // Capitalize after space
}

export function formatDate(
  value: unknown,
  dateFormat?: string,
): string | unknown {
  let date;
  if (typeof value === "string") date = parseISO(value);
  if (date && isValid(date)) return format(date, dateFormat || "yyyy-MM--dd");
  return value;
}
export function getTailwindColor(tailwindVariable: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(tailwindVariable)
    .trim();
}

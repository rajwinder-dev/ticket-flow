export function formatDate(iso: string| Date, asString: true): string;
export function formatDate(
  iso: string,
  asString?: false
): { date: string; time: string };

export function formatDate(iso: string| Date, asString?: boolean) {
  const d = new Date(iso);

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  if (asString) return `${date} at ${time}`;
  return { date, time };
}

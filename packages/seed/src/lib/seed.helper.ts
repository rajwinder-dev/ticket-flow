

export function progress(total: number, current: number) {
  const width = 30;
  const percent = current / total;
  const filled = Math.round(width * percent);

  const bar =
    "█".repeat(filled) +
    "░".repeat(width - filled);

  process.stdout.write(
    `\r[${bar}] ${(percent * 100).toFixed(0)}% ${current}/${total}`,
  );

  if (current >= total) {
    process.stdout.write("\n");
  }
}


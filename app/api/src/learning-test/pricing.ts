// Level 1 — PURE FUNCTIONS, NO MOCKING
// Goal: build fluency writing assertions and thinking about edge cases
// BEFORE any mocking complexity is introduced. If you reach for vi.mock
// anywhere in this file's test, you've misread the level.

export function calculateDiscount(price: number, percentOff: number): number {
  if (percentOff < 0 || percentOff > 100) {
    throw new Error('percentOff must be between 0 and 100');
  }
  const discounted = price - price * (percentOff / 100);
  return Math.round(discounted * 100) / 100;
}

export function applyTax(price: number, taxRate: number): number {
  return Math.round(price * (1 + taxRate) * 100) / 100;
}

export function formatCurrency(amount: number, currency: 'USD' | 'EUR' = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : '€';
  return `${symbol}${amount.toFixed(2)}`;
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  if (size <= 0) throw new Error('size must be greater than 0');
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

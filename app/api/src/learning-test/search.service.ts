// Level 5 — THE HARD ONE: SINGLETON INSTANTIATED AT MODULE LOAD TIME
// Goal: this is the exact shape that caused the "Cannot access X before
// initialization" and "is not a constructor" errors earlier. The
// `new SearchServiceClass(...)` at the bottom runs THE MOMENT this file
// is imported — before any plain `const` in your test file has run.
//
// Your job: mock SearchSdk as a real `class` (not vi.fn().mockImplementation),
// and if you reference any external variable inside that mock factory,
// reach for vi.hoisted() to define it. Predict the two errors you'll hit
// if you skip each of those steps, THEN write the test, THEN verify your
// prediction was right.

import { SearchSdk } from './search-sdk.js';

const SEARCH_API_KEY = process.env.SEARCH_API_KEY ?? 'test-key';

class SearchServiceClass {
  private sdk: SearchSdk;

  constructor(apiKey: string) {
    this.sdk = new SearchSdk({ apiKey, indexName: 'products' });
  }

  async search(term: string): Promise<{ results: string[]; count: number }> {
    if (!term.trim()) {
      return { results: [], count: 0 };
    }
    const { hits } = await this.sdk.query(term);
    const sorted = [...hits].sort((a, b) => b.score - a.score);
    return { results: sorted.map((h) => h.title), count: sorted.length };
  }

  async rebuildIndex(): Promise<boolean> {
    const { status } = await this.sdk.reindex();
    return status === 'ok';
  }
}

export const SearchService = new SearchServiceClass(SEARCH_API_KEY);

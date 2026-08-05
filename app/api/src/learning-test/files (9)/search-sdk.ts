// Pretend this is a third-party SDK, e.g. an Algolia/Elasticsearch client.

export class SearchSdk {
  constructor(private readonly config: { apiKey: string; indexName: string }) {}

  async query(term: string): Promise<{ hits: Array<{ id: string; title: string; score: number }> }> {
    throw new Error('Not implemented — stand-in for a real SDK call');
  }

  async reindex(): Promise<{ status: 'ok' | 'error' }> {
    throw new Error('Not implemented — stand-in for a real SDK call');
  }
}

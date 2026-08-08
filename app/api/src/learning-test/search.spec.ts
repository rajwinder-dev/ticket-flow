import { describe, expect, it, vi } from 'vitest';
import { SearchService } from './search.service';
// let queryMock = vi.fn().mockReturnValue({ hits: [], count: 0, status: 'ok' });
// let indexMock = vi.fn().mockResolvedValue({ status: 'ok' });
const { queryMock, indexMock } = vi.hoisted(() => ({
  queryMock: vi.fn().mockReturnValue({ hits: [], count: 0, status: 'ok' }),
  indexMock: vi.fn().mockResolvedValue({ status: 'ok' }),
}));
vi.mock('./search-sdk', () => ({
  SearchSdk: vi.fn(
    class {
      query = queryMock;
      reindex = indexMock;
    },
  ),
}));

describe('search', () => {
  it('search empty string short circuits', async () => {
    expect(SearchService.search('')).resolves.toEqual({
      results: [],
      count: 0,
    });
    expect(queryMock).not.toHaveBeenCalled();
  });
  it('search sort hits by score decending', async () => {
    queryMock.mockReturnValue({
      hits: [
        { title: 'foo', score: 2 },
        { title: 'baz', score: 1 },
      ],
      count: 2,
      status: 'ok',
    });
    expect(SearchService.search('foo')).resolves.toEqual({
      results: ['foo', 'baz'],
      count: 2,
    });
    expect(queryMock).toHaveBeenCalledWith('foo');
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('rebuildIndex for both ok and error', async () => {
    indexMock.mockReturnValueOnce({ status: 'ok' });
    indexMock.mockReturnValueOnce({ status: 'error' });
    expect(SearchService.rebuildIndex()).resolves.toEqual(true);
    expect(SearchService.rebuildIndex()).resolves.toEqual(false);
  });
});

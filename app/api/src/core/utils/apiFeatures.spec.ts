import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APIFeatures } from './apiFeatures';
import { normalize } from './utils.js';

vi.mock('./utils.js', () => ({
  normalize: vi.fn((val: unknown) => {
    if (typeof val === 'string') return val.trim() || undefined;
    return val;
  }),
}));

const mockedNormalize = vi.mocked(normalize);

describe('APIFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('sets default limit and offset', () => {
      const features = new APIFeatures({});
      expect(features.limit).toBe(10);
      expect(features.offset).toBe(0);
      expect(features.filterOptions).toEqual({});
    });

    it('does not mutate the original queryString object', () => {
      const original = { status: 'open', secret: 'hidden' };
      new APIFeatures(original, { ignore: ['secret'] });
      expect(original).toEqual({ status: 'open', secret: 'hidden' });
    });

    it('removes ignored keys from its internal queryString copy', () => {
      const queryString = { status: 'open', secret: 'hidden' };
      const features = new APIFeatures(queryString, {
        ignore: ['secret'],
      }).filter();
      expect(features.filterOptions.where).toEqual({ status: 'open' });
    });
  });

  describe('filter', () => {
    it('excludes reserved query fields', () => {
      const queryString = {
        fields: 'name,email',
        sortby: 'name',
        sortOrder: 'asc',
        limit: '10',
        offset: '0',
        search: 'foo',
        searchBy: 'name',
        status: 'open',
      };
      const features = new APIFeatures(queryString).filter();
      expect(features.filterOptions.where).toEqual({ status: 'open' });
    });

    it('parses boolean-like string values', () => {
      const features = new APIFeatures({
        active: 'true',
        archived: 'false',
      }).filter();
      expect(features.filterOptions.where).toEqual({
        active: true,
        archived: false,
      });
    });

    it('parses numeric string values', () => {
      const features = new APIFeatures({ age: '25' }).filter();
      expect(features.filterOptions.where).toEqual({ age: 25 });
    });

    it('handles bracket operator syntax', () => {
      const features = new APIFeatures({ 'price[gte]': '100' }).filter();
      expect(features.filterOptions.where).toEqual({ price: { gte: 100 } });
    });

    it('merges multiple operators on the same field', () => {
      const features = new APIFeatures({
        'price[gte]': '100',
        'price[lte]': '200',
      }).filter();
      expect(features.filterOptions.where).toEqual({
        price: { gte: 100, lte: 200 },
      });
    });

    it('does not build a search filter (handled by search() instead)', () => {
      const queryString = { searchBy: 'name', search: 'john' };
      const features = new APIFeatures(queryString).filter();
      expect(features.filterOptions.where).toEqual({});
    });

    it('ignores repeated query keys parsed as arrays by taking the first value', () => {
      const features = new APIFeatures({
        status: ['open', 'closed'],
      } as any).filter();
      expect(features.filterOptions.where).toEqual({ status: 'open' });
    });

    it('drops unsafe keys like __proto__', () => {
      const features = new APIFeatures({
        __proto__: 'x',
        status: 'open',
      } as any).filter();
      expect(features.filterOptions.where).toEqual({ status: 'open' });
    });

    it('returns an empty where object when no filters are present', () => {
      const features = new APIFeatures({}).filter();
      expect(features.filterOptions.where).toEqual({});
    });
  });

  describe('limitFields', () => {
    it('builds a select object from comma-separated fields', () => {
      const features = new APIFeatures({
        fields: 'name,email,id',
      }).limitFields();
      expect(features.filterOptions.select).toEqual({
        name: true,
        email: true,
        id: true,
      });
    });

    it('trims whitespace around field names', () => {
      const features = new APIFeatures({
        fields: 'name, email , id',
      }).limitFields();
      expect(features.filterOptions.select).toEqual({
        name: true,
        email: true,
        id: true,
      });
    });

    it('does not set select when fields is absent', () => {
      const features = new APIFeatures({}).limitFields();
      expect(features.filterOptions.select).toBeUndefined();
    });
  });

  describe('sort', () => {
    it('defaults to desc order when sortOrder is not "asc"', () => {
      const features = new APIFeatures({ sortby: 'createdAt' }).sort();
      expect(features.filterOptions.orderBy).toEqual({ createdAt: 'desc' });
    });

    it('uses asc order when sortOrder is "asc"', () => {
      const features = new APIFeatures({
        sortby: 'createdAt',
        sortOrder: 'asc',
      }).sort();
      expect(features.filterOptions.orderBy).toEqual({ createdAt: 'asc' });
    });

    it('does not set orderBy when sortby is absent', () => {
      const features = new APIFeatures({}).sort();
      expect(features.filterOptions.orderBy).toBeUndefined();
    });

    it('drops unsafe sortby keys like __proto__', () => {
      const features = new APIFeatures({ sortby: '__proto__' } as any).sort();
      expect(features.filterOptions.orderBy).toBeUndefined();
    });
  });

  describe('pagination', () => {
    it('applies default skip and take when no query params given', () => {
      const features = new APIFeatures({}).pagination();
      expect(features.filterOptions.skip).toBe(0);
      expect(features.filterOptions.take).toBe(10);
      expect(features.offset).toBe(0);
      expect(features.limit).toBe(10);
    });

    it('applies custom offset and limit from the query string', () => {
      const features = new APIFeatures({
        offset: '20',
        limit: '5',
      }).pagination();
      expect(features.filterOptions.skip).toBe(20);
      expect(features.filterOptions.take).toBe(5);
      expect(features.offset).toBe(20);
      expect(features.limit).toBe(5);
    });

    it('caps limit at the maximum allowed value', () => {
      const features = new APIFeatures({ limit: '999999' }).pagination();
      expect(features.limit).toBe(100);
      expect(features.filterOptions.take).toBe(100);
    });

    it('falls back to defaults for invalid offset/limit values', () => {
      const features = new APIFeatures({
        offset: 'abc',
        limit: '-5',
      }).pagination();
      expect(features.offset).toBe(0);
      expect(features.limit).toBe(10);
    });
  });

  describe('activeOnly', () => {
    it('adds active: true to the where clause', () => {
      const features = new APIFeatures({}).activeOnly();
      expect(features.filterOptions.where).toEqual({ active: true });
    });

    it('merges with existing where clause', () => {
      const features = new APIFeatures({ status: 'open' })
        .filter()
        .activeOnly();
      expect(features.filterOptions.where).toEqual({
        status: 'open',
        active: true,
      });
    });
  });

  describe('search', () => {
    it('adds a search filter when searchBy and search normalize to truthy values', () => {
      const features = new APIFeatures({
        searchBy: 'name',
        search: 'john',
      }).search();
      expect(mockedNormalize).toHaveBeenCalledWith('name');
      expect(mockedNormalize).toHaveBeenCalledWith('john');
      expect(features.filterOptions.where).toEqual({
        name: { contains: 'john', mode: 'insensitive' },
      });
    });

    it('does not add a search filter when search is missing', () => {
      const features = new APIFeatures({ searchBy: 'name' }).search();
      expect(features.filterOptions.where).toBeUndefined();
    });

    it('does not add a search filter when searchBy is missing', () => {
      const features = new APIFeatures({ search: 'john' }).search();
      expect(features.filterOptions.where).toBeUndefined();
    });

    it('drops unsafe searchBy keys like __proto__', () => {
      const features = new APIFeatures({
        searchBy: '__proto__',
        search: 'x',
      } as any).search();
      expect(features.filterOptions.where).toBeUndefined();
    });

    it('merges with an existing where clause from filter()', () => {
      const features = new APIFeatures({
        status: 'open',
        searchBy: 'name',
        search: 'john',
      })
        .filter()
        .search();
      expect(features.filterOptions.where).toEqual({
        status: 'open',
        name: { contains: 'john', mode: 'insensitive' },
      });
    });
  });
});

import { ParsedQs } from 'qs';
import { normalize } from './utils.js';

type SortOrder = 'asc' | 'desc';

interface PrismaFilterOptions {
  where?: Record<string, unknown>;
  select?: Record<string, boolean>;
  orderBy?: Record<string, SortOrder>;
  include?: Record<string, unknown>;
  skip?: number;
  take?: number;
}

const RESERVED_QUERY_KEYS = [
  'fields',
  'sortby',
  'sortOrder',
  'limit',
  'offset',
  'search',
  'searchBy',
];

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

/** Takes the first value if qs parsed a field as an array (e.g. repeated query keys). */
function firstValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function isSafeKey(key: string): boolean {
  return key.length > 0 && !UNSAFE_KEYS.has(key);
}

/** Parses a positive integer from a query value, falling back to `fallback` if invalid. */
function parsePositiveInt(value: unknown, fallback: number): number {
  const raw = firstValue(value);
  if (raw === undefined || raw === null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || Number.isNaN(n) || n < 0) return fallback;
  return Math.floor(n);
}

export class APIFeatures {
  private queryString: ParsedQs;
  filterOptions: PrismaFilterOptions;
  limit: number;
  offset: number;
  ignore?: { ignore: string[] };

  constructor(queryString: ParsedQs, ignore?: { ignore: string[] }) {
    this.ignore = ignore;
    this.filterOptions = {};
    // Shallow-copy so we never mutate the caller's object.
    this.queryString = { ...queryString };
    this.limit = DEFAULT_LIMIT;
    this.offset = DEFAULT_OFFSET;

    this.ignore?.ignore.forEach((item) => {
      delete this.queryString[item];
    });
  }

  filter() {
    const queryObj = { ...this.queryString };
    RESERVED_QUERY_KEYS.forEach((el) => delete queryObj[el]);

    const selectedFilters: Record<string, unknown> = {};

    for (const [rawKey, rawValueRaw] of Object.entries(queryObj)) {
      const match = rawKey.match(/^(\w+)(\[(\w+)\])?$/);
      if (!match) continue;

      const field = match[1];
      const operator = match[3];
      if (!isSafeKey(field)) continue;

      const rawValue = firstValue(rawValueRaw);
      let value: unknown = rawValue;

      if (rawValue === 'true') value = true;
      else if (rawValue === 'false') value = false;
      else if (
        typeof rawValue === 'string' &&
        rawValue.trim() !== '' &&
        !isNaN(Number(rawValue))
      ) {
        value = Number(rawValue);
      }

      if (operator && isSafeKey(operator)) {
        selectedFilters[field] = {
          ...(typeof selectedFilters[field] === 'object' &&
          selectedFilters[field] !== null
            ? (selectedFilters[field] as Record<string, unknown>)
            : {}),
          [operator]: value,
        };
      } else {
        selectedFilters[field] = value;
      }
    }

    this.filterOptions = {
      ...this.filterOptions,
      where: { ...this.filterOptions.where, ...selectedFilters },
    };
    return this;
  }

  limitFields() {
    const fields = firstValue(this.queryString.fields);
    if (!fields || typeof fields !== 'string') return this;

    const selectedField: Record<string, boolean> = {};
    fields
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && isSafeKey(item))
      .forEach((item) => {
        selectedField[item] = true;
      });

    if (Object.keys(selectedField).length > 0) {
      this.filterOptions = { ...this.filterOptions, select: selectedField };
    }
    return this;
  }

  sort() {
    const sortby = firstValue(this.queryString.sortby);
    const sortOrder = firstValue(this.queryString.sortOrder);
    const order: SortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    if (sortby && typeof sortby === 'string' && isSafeKey(sortby)) {
      this.filterOptions = {
        ...this.filterOptions,
        orderBy: { [sortby]: order },
      };
    }
    return this;
  }

  pagination() {
    // Parse first, THEN derive skip/take, so custom offset/limit are honored.
    this.offset = parsePositiveInt(this.queryString.offset, DEFAULT_OFFSET);
    const requestedLimit = parsePositiveInt(
      this.queryString.limit,
      DEFAULT_LIMIT,
    );
    this.limit = Math.min(requestedLimit || DEFAULT_LIMIT, MAX_LIMIT);

    this.filterOptions = {
      ...this.filterOptions,
      skip: this.offset,
      take: this.limit,
    };
    return this;
  }

  activeOnly() {
    this.filterOptions = {
      ...this.filterOptions,
      where: {
        ...this.filterOptions.where,
        active: true,
      },
    };
    return this;
  }

  search() {
    const searchBy = normalize(firstValue(this.queryString.searchBy));
    const search = normalize(firstValue(this.queryString.search));

    if (
      searchBy &&
      search &&
      typeof searchBy === 'string' &&
      isSafeKey(searchBy)
    ) {
      this.filterOptions = {
        ...this.filterOptions,
        where: {
          ...this.filterOptions.where,
          [searchBy]: {
            contains: String(search),
            mode: 'insensitive',
          },
        },
      };
    }
    return this;
  }
}

import { ParsedQs } from "qs";
import { normalize } from "./utils.js";

type SortOrder = "asc" | "desc";

interface PrismaFilterOptions {
  where?: Record<string, unknown>;
  select?: Record<string, boolean>;
  orderBy?: Record<string, SortOrder>;
  include?: Record<string, unknown>;
  skip?: number;
  take?: number;
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
    this.queryString = queryString;
    this.limit = 30;
    this.offset = 0;
    this.ignore?.ignore.map((item) => {
      delete this.queryString[item];
    });
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = [
      "fields",
      "sortby",
      "sortOrder",
      "limit",
      "offset",
      "search",
      "searchBy",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    // handle filter logic
    const selectedFilters: Record<string, unknown> = {};
    for (const [rawKey, rawValue] of Object.entries(queryObj)) {
      const match = rawKey.match(/^(\w+)(\[(\w+)\])?$/);
      if (!match) continue;
      const field = match[1];
      const operator = match[3];
      let value: unknown = rawValue;
      if (rawValue === "true") value = true;
      else if (rawValue === "false") value = false;
      else if (!isNaN(Number(rawValue))) value = Number(rawValue);

      if (operator) {
        selectedFilters[field] = { [operator]: value };
      } else {
        selectedFilters[field] = value;
      }
    }
    // handle search logic
    if (queryObj?.searchBy && queryObj?.search) {
      selectedFilters[queryObj.searchBy as string] = {
        contains: queryObj.search,
        mode: "insensitive",
      };
      delete selectedFilters.search;
      delete selectedFilters.searchBy;
    }
    this.filterOptions = { ...this.filterOptions, where: selectedFilters };
    return this;
  }
  limitFields() {
    const { fields } = this.queryString;
    const selectedField: { [key: string]: boolean } = {};
    if (fields) {
      String(fields)
        .split(",")
        .forEach((item: string) => {
          return (selectedField[item] = true);
        });
      this.filterOptions = { ...this.filterOptions, select: selectedField };
    }
    return this;
  }
  sort() {
    const { sortby, sortOrder } = this.queryString;
    const order = sortOrder === "asc" ? "asc" : "desc";
    if (sortby && typeof sortby === "string") {
      this.filterOptions = {
        ...this.filterOptions,
        orderBy: { [sortby]: order },
      };
    }
    return this;
  }
  pagination() {
    const { offset, limit } = this.queryString;
    this.filterOptions = {
      ...this.filterOptions,
      skip: this.offset,
      take: this.limit,
    };

    if (offset) this.offset = Number(offset);
    if (limit) this.limit = Number(limit);
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
    const data = this.queryString;
    const searchBy = normalize(data.searchBy);
    const search = normalize(data.search);
    if (searchBy && search) {
      this.filterOptions = {
        ...this.filterOptions,
        where: {
          ...this.filterOptions.where,
          [searchBy as string]: {
            contains: String(search),
            mode: "insensitive",
          },
        },
      };
    }
    return this;
  }
}

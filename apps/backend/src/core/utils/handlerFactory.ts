/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedQs } from "qs";
import { APIFeatures } from "./apiFeatures";
interface QueryOptions {
  select?: Record<string, boolean>;
  include?: Record<string, unknown>;
  where?: Record<string, unknown>;
}
interface GetMany<T> {
  data: T;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

export default class HandleFactory<T> {
  constructor(private model: any) {}

  /**
   * Get many records with filtering, sorting, and pagination.
   */
  async getAll(query: ParsedQs, options: QueryOptions = {}): Promise<GetMany<T>> {
    const features = new APIFeatures(query).filter().sort().limitFields().pagination();

    const { filterOptions, limit, offset } = features;
    const queryArgs = {
      where: { ...filterOptions.where, ...options.where },
      include: options.include,
      select: options.select,
      take: limit,
      skip: offset,
      orderBy: filterOptions.orderBy,
    };

    const [data, total] = await Promise.all([
      this.model.findMany(queryArgs),
      this.model.count({ where: queryArgs.where }),
    ]);

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    };
  }
  async getOne(id: string, options: QueryOptions = {}): Promise<T> {
    const data = await this.model.findUnique({
      where: { id, ...options.where },
      include: options.include,
      select: options.select,
    });

    return data;
  }
  async create(payload: Partial<T>): Promise<T> {
    return await this.model.create({
      data: payload,
    });
  }
  async update(id: string, payload: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data: payload,
    });
  }
  async delete(id: string) {
    return await this.model.delete({
      where: { id },
    });
  }
  async softDelete(id: string) {
    return await this.model.update({
      where: { id: id },
      data: { active: false },
    });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchAsync } from "./catchAsync";
import { appError } from "./appError";
import { APIFeatures } from "./apiFeatures";
import response from "./response";
import { notificationServer } from "../../modules/notification/notification.service";
/**
 * Generic CRUD handler factory for prisma
 * usage:
 * ```ts
 * const handler = new HandleFactory(prisma.user);
 * route.get("/user/id", handler.getOne({exclude: ['password']}))
 * ```
 * each method support configuration via the `type<T>`
 */
interface types<T> {
  exclude?: Extract<keyof T, string>[];
  select?: Extract<keyof T, string>[];
  params?: string;
  protect?: boolean;
  useField?: string;
  includeRelation?: string;
  includeFields?: string[];
  notify?: string;
  broadCast?: ["all" | "admin" | "employee" | "manager"];
  otherOptions?: object;
}
// Generic CRUD handler class
type FactoryOptions = {
  enableDelete?: boolean;
};
export default class HandleFactory<Data> {
  Model: any;
  options: Required<FactoryOptions>;
  /**
   * Initializes the handler with a specific model (e.g., Prisma model).
   * @param Model - The ORM model to operate on.
   */
  constructor(Model: any, options: FactoryOptions = {}) {
    this.Model = Model;
    this.options = {
      enableDelete: options.enableDelete ?? false,
    };
  }
  /**
   * Get a single record by ID or custom field.
   *
   * @param options - Custom behavior settings (e.g., exclude fields, use different lookup key).
   * @returns An Express middleware function.
   */
  getOne = (options?: types<Data>) =>
    catchAsync(async (req, res, next) => {
      let filterOptions: Record<string, any> = {};
      let property;
      if (options?.protect) {
        property = { [options?.useField || "id"]: req.user.employeeId };
      } else if (req.params.id) {
        property = { [options?.params || "id"]: Number(req.params.id) };
      }
      if (options?.includeRelation) {
        filterOptions = {
          ...filterOptions,
          include: this.includeRelations(
            options?.includeRelation,
            options?.includeFields
          ),
        };
      }
      if (property) {
        if (!filterOptions) filterOptions = {};
        filterOptions.where = property;
      }
      if (this.options?.enableDelete) filterOptions.where.active = true;
      const data = await this.Model.findUnique({ ...filterOptions });
      if (!data)
        return next(
          new appError(
            `No record found with id ${req.params.id}`,
            404,
            "NOT_FOUND"
          )
        );

      response(res, data, 200, {
        hideFields: options?.exclude,
      });
    });

  getMany = (options?: types<Data>) =>
    catchAsync(async (req, res, next) => {
      let apiFeatures = new APIFeatures(req)
      .filter()
      .limitFields()
      .pagination()
      .sort();
      if (this.options?.enableDelete) {
        apiFeatures = apiFeatures.activeOnly();
      }
      // eslint-disable-next-line prefer-const
      let { filterOptions, offset, limit } = apiFeatures;

      let property;
      if (req.params)
        property = { [options?.params || "id"]: Number(req.params.id) };
      if (options?.otherOptions) {
        filterOptions = {
          ...filterOptions,
          ...options?.otherOptions,
        };
        if (!filterOptions.include && options?.includeRelation) {
          filterOptions.include = this.includeRelations(
            options.includeRelation,
            options.includeFields
          );
        }
      }
      if (options?.select) {
        filterOptions.select = this.selectFields(options.select);
      }
      if (property && isNaN(Object.values(property)[0])) property = undefined;
      if (options?.protect) {
        property = { [options?.useField || "id"]: req.user.employeeId };
      } else if (req.params.id) {
        property = { [options?.params || "id"]: Number(req.params.id) };
        const verifyExist = await this.Model.findFirst({
          where: {
            ...property,
          },
        });
        if (!verifyExist)
          next(new appError("Record not exist", 404, "NOT_FOUND"));
      }
      if (property && filterOptions) filterOptions.where = property;
      const data = await this.Model.findMany({
        ...filterOptions,
        take: limit,
        skip: offset,
      });
      const total = await this.Model.count({ where: filterOptions?.where });
      // data with serial number
      const newData = data.map((item: object, i: number) => ({
        srNo: offset + i + 1,
        ...item,
      }));
      response(res, [...newData], 200, {
        otherFields: { offset, limit, total },
        hideFields: options?.exclude,
      });
    });

  createOne = (options?: types<Data>) =>
    catchAsync(async (req, res, _next) => {
      // eslint-disable-next-line prefer-const
      let input = { ...req.body };
      if (options) {
        const {
          params = "id",
          protect,
          useField = "employeeId",
          exclude,
        } = options;
        if (req.params.id) input[params] = Number(req.params.id);
        if (protect) input[useField] = req.user.employeeId;
        if (exclude) this.restrictFieldsToChange(input, exclude);
      }
      //  handle data
      const data = await this.Model.create({
        data: input,
      });
      if (options?.notify)
        notificationServer.sendNotification(
          Number(req.user.employeeId),
          data?.employeeId || req.user.employeeId,
          options?.notify,
          options?.broadCast
        );
      response(res, data, 201, { hideFields: options?.exclude });
    });

  updateOne = (options?: types<Data>) =>
    catchAsync(async (req, res, _next) => {
      const input = req.body;
      if (options?.exclude) this.restrictFieldsToChange(input, options.exclude);
      let property: Record<string, any>;
      if (options?.protect) {
        property = { [options?.useField || "id"]: req.user.employeeId };
      } else {
        property = { [options?.params || "id"]: Number(req.params.id) };
      }
      property.active = true;
      const data = await this.Model.update({
        where: property,
        data: { ...input },
      });
      if (options?.notify)
        notificationServer.sendNotification(
          Number(req.user.employeeId),
          data?.employeeId || req.user.employeeId,
          options?.notify,
          options?.broadCast
        );
      response(res, data, 200, { hideFields: options?.exclude });
    });

  deleteOne = (options?: types<Data>) =>
    catchAsync(async (req, res, next) => {
      const property = { [options?.params || "id"]: Number(req.params.id) };
      if (!this.options.enableDelete)
        return console.log("EnableDelete in class instance");
      const verifyDelete = await this.Model.findUnique({
        where: property,
      });
      if (!verifyDelete || !verifyDelete.active)
        return next(
          new appError(
            `No record found with id ${req.params.id}`,
            404,
            "NOT_FOUND"
          )
        );
      const data = await this.Model.update({
        where: property,
        data: { active: false },
      });

      if (options?.notify)
        notificationServer.sendNotification(
          Number(req.user.employeeId),
          data?.employeeId || req.user.employeeId,
          options?.notify,
          options?.broadCast
        );
      response(res, null, 204);
    });

  removeOne = (options?: types<Data>) =>
    catchAsync(async (req, res, _next) => {
      const property = { [options?.params || "id"]: Number(req.params.id) };
      const data = await this.Model.delete({ where: property });
      if (options?.notify)
        notificationServer.sendNotification(
          Number(req.user.employeeId),
          data?.employeeId || req.user.employeeId,
          options?.notify,
          options?.broadCast
        );
      response(res, null, 204);
    });

  private restrictFieldsToChange = (
    input: Record<string, string>,
    body: string[]
  ) => {
    delete input.id;
    delete input.createdAt;
    body.forEach((item) => {
      delete input[item];
    });
  };
  private includeRelations = (
    fieldsToAdd: string,
    includeFields?: string[]
  ) => {
    const obj: Record<string, boolean> = {};
    if (!includeFields) return { [fieldsToAdd]: true };
    includeFields.forEach((item) => {
      obj[item] = true;
    });
    return { [fieldsToAdd]: { select: obj } };
  };
  private selectFields = (fields: string[]) => {
    const obj: Record<string, boolean> = {};
    fields.forEach((item) => {
      obj[item] = true;
    });
    return obj;
  };
}

import { NextFunction, Request, Response } from "express";
import { log } from "../helper/log.js";
export class DevMiddleware {
  static logRequests = (req: Request, res: Response, next: NextFunction) => {
    const isBodyExist =
      req.body && typeof req.body === "object" && Object.keys(req.body).length > 0;
    const isParamsExist =
      req.params && typeof req.params === "object" && Object.keys(req.params).length > 0;
    const isQueryExist =
      req.query && typeof req.query === "object" && Object.keys(req.query).length > 0;

    if (isParamsExist) log.data("Params", req.params);
    if (isBodyExist) log.data("Body", req.body);
    if (isQueryExist) log.data("Query", req.query);

    if (isBodyExist || isParamsExist || isQueryExist) console.log("—".repeat(30));

    next();
  };
}

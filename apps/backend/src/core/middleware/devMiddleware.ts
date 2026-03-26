import { NextFunction, Request, Response } from "express";
import { log } from "../helper/log";
export class DevMiddleware {
  static logRequests = (req: Request, res: Response, next: NextFunction) => {
    const isBodyExist =
      req.body && typeof req.body === "object" && Object.keys(req.body).length > 0;
    const isPramsExist =
      req.params && typeof req.params === "object" && Object.keys(req.params).length > 0;
    if (isBodyExist) log.data("Query", req.query);
    if (isPramsExist) log.data("body", req.body);
     if(isBodyExist || isPramsExist) console.log("—".repeat(30));
    next();
  };
}

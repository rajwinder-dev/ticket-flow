import { NextFunction, Request, Response } from "express";

export const  devMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("Query:", Object.assign({}, req.query));
    console.log("Body:", Object.assign({}, req.body));
    console.log("----------------------------");
    next();
  };

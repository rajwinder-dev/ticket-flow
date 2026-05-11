import { ErrorRequestHandler } from "express";

import { log } from "../../core/helper/log.js";
import { devMode } from "../../config/appConfig.js";
import { appError } from "./appError.js";
import { deleteUploadedFilesLocal } from "./utils.js";
export const globalHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const files = req.files as Express.Multer.File[];
  if (files) {
    const paths = files.map((file: Express.Multer.File) => file.path);
    deleteUploadedFilesLocal(paths);
  }
  if (devMode) console.dir(error);
  else log.error(error.message);
  if (error.name === "PrismaClientValidationError") {
    error = new appError("Invalid Input , please check your query", 400, "VALIDATION_ERROR");
  }
  // Data Integrity & Constraints
  if (error.code === "P2002") {
    const field = error.meta?.target || "field";
    error = new appError(`Duplicate value for ${field}.`, 409, "CONFLICT_ERROR");
  } else if (error.code === "P2025") {
    error = new appError("Record not found.", 404, "NOT_FOUND");
  } else if (error.code === "P2003") {
    error = new appError(
      "Invalid reference. Related record does not exist.",
      400,
      "FOREIGN_KEY_ERROR",
    );
  } else if (error.code === "P2011") {
    error = new appError("Required field cannot be null.", 400, "NULL_CONSTRAINT");
  } else if (error.code === "P2012") {
    error = new appError("Missing required field.", 400, "VALIDATION_ERROR");
  } else if (error.code === "P2006") {
    error = new appError("Invalid value provided for a field.", 400, "VALIDATION_ERROR");
  } else if (error.code === "P1001") {
    error = new appError("Database connection failed.", 503, "DB_CONNECTION_ERROR");
  } else if (error.code === "P2024") {
    error = new appError("Database request timed out.", 504, "DB_TIMEOUT");
  }
  const finalResponse = {
    status: error.status || "error",
    message: error.code ? error.message : "Internal Server error",
    code: error.code,
    data: error.data,
    timeStamp: new Date(),
  };
  res.status(error.statusCode || 500).json(finalResponse);
};

import { ErrorRequestHandler } from "express";
import { devMode } from "../../config/appConfig";
import { appError } from "./appError";
import { deleteUploadedFilesLocal } from "./utils";
export const globalHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (devMode) console.error(error);
  const files = req.files as Express.Multer.File[];
  if (files) {
    const paths = files.map((file: Express.Multer.File) => file.path);
    deleteUploadedFilesLocal(paths);
  }

  if (error.name === "PrismaClientValidationError") {
    error = new appError("Invalid Input , please check your query", 400, "DB_VALIDATION_ERROR");
  }
  // Data Integrity & Constraints
  if (error.code === "P2002") {
    const field = error.meta?.target || "field";
    error = new appError(`Duplicate value for ${field}.`, 409, "DUPLICATE_RECORD");
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
    error = new appError("Missing required field.", 400, "MISSING_REQUIRED_FIELD");
  } else if (error.code === "P2006") {
    error = new appError("Invalid value provided for a field.", 400, "INVALID_FIELD_VALUE");
  } else if (error.code === "P1001") {
    error = new appError("Database connection failed.", 503, "DATABASE_CONNECTION_ERROR");
  } else if (error.code === "P2024") {
    error = new appError("Database request timed out.", 504, "DATABASE_TIMEOUT");
  }
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message,
    code: error.code,
    ...(error.data && { error: error.data }),
  });
};

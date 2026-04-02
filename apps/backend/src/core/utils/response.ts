import { Response } from "express";
import z from "zod";
import { appError } from "./appError";

/**
 * TYPES & INTERFACES
 */
type InferInput<T> = T extends z.ZodTypeAny ? z.input<T> : unknown;

interface ResponseOptions<T extends z.ZodTypeAny> {
  schema?: T; // Optional Zod schema to validate the outgoing data
  otherFields?: object; // Any extra metadata (pagination, etc.)
}

/**
 * Sends a standardized JSON response.
 * Handles both simple messages and complex, validated data objects.
 */
export function sendResponse<T extends z.ZodTypeAny>(
  res: Response,
  data: InferInput<T> | string,
  statusCode: number = 200,
  options: ResponseOptions<T> = {},
) {
  let finalPayload: InferInput<T> | string | z.output<T> = data;

  // 1. VALIDATION: If a schema is provided, parse the data
  if (options.schema && typeof data !== "string") {
    const result = options.schema.safeParse(data);

    if (!result.success) {
      console.error("❌ RESPONSE VALIDATION FAILED:", result.error.format());
      throw new appError("Internal Server Error: Malformed response data", 500);
    }
    finalPayload = result.data;
  }

  // 2. CONSTRUCTION: Build the standard response object
  const isMessageOnly = typeof data === "string";
  const finalResponse = {
    status: statusCode >= 400 ? "error" : "success",
    timestamp: new Date().toISOString(),
    ...(options.otherFields ?? {}),
    ...(isMessageOnly ? { message: data } : { data: finalPayload }),
  };
  return res.status(statusCode).json(finalResponse);
}

export default sendResponse;

import { Response } from "express";
import z from "zod";
import { log } from "../helper/log.js";

/**
 * TYPES & INTERFACES
 */

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
  data: unknown,
  statusCode: number = 200,
  options: ResponseOptions<T> = {},
) {
  let finalPayload: unknown = data;

  if (options.schema && typeof data !== "string") {
    const result = options.schema.safeParse(data);

    if (!result.success) {
      log.warn("RESPONSE VALIDATION WARNING");
      // log.data("Error", result.error)
    } else {
      finalPayload = result.data;
    }
  }

  return res.status(statusCode).json({
    success: true,
    data: finalPayload,
    ...options.otherFields,
  });
}

export default sendResponse;

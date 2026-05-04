import z, { ZodError, ZodIssue } from "zod";
import { appError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export function validationMiddleware({
  bodySchema,
  paramsSchema,
  querySchema,
}: {
  bodySchema?: z.Schema;
  paramsSchema?: z.Schema;
  querySchema?: z.Schema;
}) {
  return catchAsync(async (req, res, next) => {
    if (bodySchema) {
      const result = bodySchema.safeParse(req.body);
      if (!result.success)
        return next(
          new appError(
            `BODY: ${formatZodErrorToMessage(result.error)}`,
            400,
            "VALIDATION_ERROR",
            formatZodErrors(result.error),
          ),
        );
      req.body = result.data;
    }

    if (paramsSchema) {
      const result = paramsSchema.safeParse(req.params);
      if (!result.success)
        return next(
          new appError(
            `PARAMS: ${formatZodErrorToMessage(result.error)}`,
            400,
            "VALIDATION_ERROR",
            formatZodErrors(result.error),
          ),
        );
    }

    if (querySchema) {
      const result = querySchema.safeParse(req.query);
      if (!result.success)
        return next(
          new appError(
            `QUERY: ${formatZodErrorToMessage(result.error)}`,
            400,
            "VALIDATION_ERROR",
            formatZodErrors(result.error),
          ),
        );
    }

    next();
  });
}
function formatZodErrors(zodError: ZodError) {
  return zodError.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
export function formatZodErrorToMessage(
  error: ZodError,
  options?: {
    separator?: string; // join multiple errors
    includePath?: boolean; // include field path
  },
): string {
  const separator = options?.separator ?? ", ";
  const includePath = options?.includePath ?? true;

  if (!error?.issues?.length) return "Validation error";

  const messages = error.issues.map((issue: ZodIssue) => {
    const path = issue.path.join(".");
    const baseMessage = issue.message || "Invalid value";

    if (!includePath || !path) return baseMessage;

    return `${path}: ${baseMessage}`;
  });

  return messages.join(separator);
}

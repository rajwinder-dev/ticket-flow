type Code =
  | "NOT_FOUND"
  | "CONFLICT_ERROR"
  | "UNKNOWN"
  | "INTERNAL_ERROR"
  | "FORBIDDEN"
  | "INVALID_TOKEN"
  | "EXPIRED_TOKEN"
  | "VALIDATION_ERROR"
  | "INVALID_ROUTE"
  | "INVALID_CREDENTIALS"
  | "UNSUPPORTED"
  ;
export class appError extends Error {
  statusCode: number;
  status: string;
  code: Code;
  isOperational: boolean;
  data?: object;
  constructor(message: string, statusCode: number, code?: Code, data?: object) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || "UNKNOWN";
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.isOperational = code ? false : true;
    if (data) {
      this.data = data;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

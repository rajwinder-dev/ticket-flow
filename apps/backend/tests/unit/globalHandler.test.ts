import { describe, expect, it, vitest, beforeEach, afterEach } from "vitest";
import httpMocks from "node-mocks-http";
import { globalHandler } from "../../src/core/utils/globalHandler.js";

const mockDeleteLocalFiles = vitest.fn();
vitest.mock("../utils/fileUtils.js", () => ({
  deleteUploadedFilesLocal: (paths: string[]) => mockDeleteLocalFiles(paths),
}));
vitest.mock("../config/index.js", () => ({
  devMode: false,
}));

describe("Global Error Handler Middleware", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    vitest.useFakeTimers(); // Freeze time to predictably test timestamps
    vitest.setSystemTime(new Date("2026-06-17T12:00:00.000Z"));
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  it("should translate a PrismaClientValidationError into a 400 validation error", () => {
    const prismaError = new Error("Mocked Prisma Validation Failure");
    prismaError.name = "PrismaClientValidationError";

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(prismaError, req, res, vitest.fn());

    expect(res.statusCode).toBe(400);
    const body = res._getJSONData();
    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.message).toBe("Invalid Input , please check your query");
  });
  //
  it("should handle a Prisma P duplicate unique constraint error cleanly", () => {
    const duplicateError: any = new Error("Unique constraint failed");
    duplicateError.code = "P2002";
    duplicateError.meta = { target: ["email"] };

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(duplicateError, req, res, vitest.fn());

    expect(res.statusCode).toBe(409);
    const body = res._getJSONData();
    expect(body.code).toBe("CONFLICT_ERROR");
    expect(body.message).toContain("Duplicate value for email.");
  });
  //
  it("should fallback to a default generic message string for field when target meta is missing in P2002", () => {
    const duplicateError: any = new Error("Unique constraint failed");
    duplicateError.code = "P2002"; // No meta target assigned

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(duplicateError, req, res, vitest.fn());

    const body = res._getJSONData();
    expect(body.message).toBe("Duplicate value for field.");
  });
  it("should translate a Prisma P2025 Not Found error", () => {
    const notFoundError: any = new Error("Record not found");
    notFoundError.code = "P2025";

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(notFoundError, req, res, vitest.fn());

    expect(res.statusCode).toBe(404);
    const body = res._getJSONData();
    expect(body.code).toBe("NOT_FOUND");
  });
  //
  it("should translate a Prisma P1001 infrastructure database connection failure", () => {
    const connectionError: any = new Error("Can't reach database server");
    connectionError.code = "P1001";

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(connectionError, req, res, vitest.fn());

    expect(res.statusCode).toBe(503);
    const body = res._getJSONData();
    expect(body.code).toBe("DB_CONNECTION_ERROR");
  });
  //
  it("should return a generic 500 error payload for non-prisma baseline exceptions", () => {
    const rawError = new Error("Some critical system error");

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    globalHandler(rawError, req, res, vitest.fn());

    expect(res.statusCode).toBe(500);
    const body = res._getJSONData();
    expect(body).toEqual({
      status: "error",
      message: "Internal Server error", // Masked because error.code doesn't exist
      code: undefined,
      data: undefined,
      timeStamp: "2026-06-17T12:00:00.000Z",
    });
  });
});

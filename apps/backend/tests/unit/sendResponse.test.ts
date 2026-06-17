import { describe, expect, it, vitest, beforeEach, afterEach } from "vitest";
import z from "zod";
import httpMocks from "node-mocks-http";
import sendResponse from "../../src/core/utils/response.js";
import { log } from "@repo/utils";

describe("sendResponse Utility", () => {
  let warnSpy: any;

  beforeEach(() => {
    warnSpy = vitest.spyOn(log, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("should send a basic successful response with default 200 status", () => {
    const res = httpMocks.createResponse();
    const testData = { message: "Hello World" };

    sendResponse(res, testData);

    expect(res.statusCode).toBe(200);

    const dataInsideBody = res._getJSONData();
    expect(dataInsideBody).toEqual({
      success: true,
      data: { message: "Hello World" },
    });
  });

  it("should respect custom status codes", () => {
    const res = httpMocks.createResponse();
    const testData = { item: "Created" };

    sendResponse(res, testData, 201);

    expect(res.statusCode).toBe(201);
  });

  it("should spread otherFields (like pagination) into the root payload", () => {
    const res = httpMocks.createResponse();
    const testData = [{ id: 1 }, { id: 2 }];
    const options = {
      otherFields: {
        pagination: { page: 1, limit: 10, total: 2 },
      },
    };

    sendResponse(res, testData, 200, options);

    const payload = res._getJSONData();
    expect(payload).toEqual({
      success: true,
      data: [{ id: 1 }, { id: 2 }],
      pagination: { page: 1, limit: 10, total: 2 },
    });
  });

  it("should strip out unexpected fields when a valid schema is provided", () => {
    const res = httpMocks.createResponse();
    const userSchema = z.object({
      id: z.number(),
      username: z.string(),
    });

    const sensitiveData = {
      id: 42,
      username: "alex",
      passwordHash: "super-secret-hash", // This should be stripped
    };

    sendResponse(res, sensitiveData, 200, { schema: userSchema });

    const payload = res._getJSONData();
    expect(payload.data).toEqual({ id: 42, username: "alex" });
    expect(payload.data.passwordHash).toBeUndefined();
    expect(log.warn).not.toHaveBeenCalled();
  });

  it("should bypass schema validation if data is a primitive string", () => {
    const res = httpMocks.createResponse();
    const schema = z.object({ id: z.number() });
    const stringMessage = "Operation completed successfully";

    sendResponse(res, stringMessage, 200, { schema });

    const payload = res._getJSONData();
    expect(payload.data).toBe("Operation completed successfully");
    expect(log.warn).not.toHaveBeenCalled();
  });

it("should log a warning and fall back to raw data if validation fails", () => {
    const res = httpMocks.createResponse();
    const strictSchema = z.object({
      email: z.email(),
    });

    const invalidData = {
      email: "not-an-email",
    };

    sendResponse(res, invalidData, 200, { schema: strictSchema });

    // Assert that the spy intercepted the execution
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("RESPONSE VALIDATION WARNING");

    // Ensure the response fallback safely fires
    const payload = res._getJSONData();
    expect(payload.success).toBe(true);
    expect(payload.data).toEqual({ email: "not-an-email" });
  });
});

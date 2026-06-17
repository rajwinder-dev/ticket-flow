import { describe, expect, it, vitest } from "vitest";
import z from "zod";
import { validationMiddleware } from "../../src/core/middleware/validationMiddleware.js";
import httpMocks from "node-mocks-http";

describe("Validate middleware test - Reliability & Edge Cases", async () => {
  it("should fail validation and call next() with an error if body is invalid", async () => {
    const bodySchema = z.object({
      username: z.string().min(5),
    });
    const middleware = validationMiddleware({ bodySchema });

    const req = httpMocks.createRequest({
      body: { username: "raj" }, // Too short, will fail validation
    });
    const res = httpMocks.createResponse();
    const next = vitest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    
    // Asserting the Error properties match your middleware design
    expect(errorPassed).toBeDefined();
    expect(errorPassed.statusCode).toBe(400);
    expect(errorPassed.code).toBe("VALIDATION_ERROR");
    expect(errorPassed.message).toContain("BODY:");
  });

  it("should fail validation if query parameters are missing required fields", async () => {
    const querySchema = z.object({
      page: z.string(),
    });
    const middleware = validationMiddleware({ querySchema });

    const req = httpMocks.createRequest({ query: {} }); // Missing page
    const res = httpMocks.createResponse();
    const next = vitest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.message).toContain("QUERY:");
  });


  it("should pass smoothly if no schemas are provided at all", async () => {
    const middleware = validationMiddleware({}); // No schemas passed

    const req = httpMocks.createRequest({ body: { data: "anything" } });
    const res = httpMocks.createResponse();
    const next = vitest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Called with no errors
    expect(req.body).toEqual({ data: "anything" });
  });

  it("should successfully coerce data types for query and params", async () => {
    const querySchema = z.object({
      limit: z.coerce.number(), // Coerces "10" -> 10
    });
    const middleware = validationMiddleware({ querySchema });

    const req = httpMocks.createRequest({
      query: { limit: "10" },
    });
    const res = httpMocks.createResponse();
    const next = vitest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query.limit).toBe(10); 
  });
});

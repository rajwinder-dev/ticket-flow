import { Request } from "express";

export function getClientIp(req: Request) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0].trim();
  }
  return req?.socket?.remoteAddress || null;
}

export function parseJson<T>(data: string): T {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Invalid JSON");
  }
}

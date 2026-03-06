import { Request } from "express";

export function getClientIp(req: Request) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    // Multiple IPs in proxy chain
    return xForwardedFor.split(",")[0].trim();
  }
  return req?.socket?.remoteAddress || null;
}



import { Request } from "express";

export function getClientIp(req: Request) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    // Multiple IPs in proxy chain
    return xForwardedFor.split(",")[0].trim();
  }
  return req?.socket?.remoteAddress || null;
}
// replace with cookies
// export function responseCookie(
//   req: Request,
//   res: Response,
//   cookieName: string,
//   data: string
// ) {
//   res.cookie(cookieName, data, {
//     expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
//     httpOnly: true, // Always secure from JS access
//     secure: process.env.SKIP_WSS === "true" ? false : true,
//     sameSite: "strict",
//     path: "/",
//   });
// }

// export function clearCookie(res: Response, cookieName: string) {
//   res.clearCookie(cookieName, {
//     httpOnly: true,
//     secure: process.env.SKIP_WSS === "true" ? false : true,
//     sameSite: "strict",
//     path: "/",
//   });
// }

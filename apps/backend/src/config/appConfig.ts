import { env } from "./env";

export const devMode = env.nodeEnv === "development";
// this used to remove filed form output before leaving server through response()
export const excludeResponseField = [
  "active",
  "password",
  "passwordHash",
  "passwordResetToken",
  "passwordResetExpire",
  "passwordChangeAt"
];




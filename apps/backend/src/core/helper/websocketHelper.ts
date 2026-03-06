import { verify } from "jsonwebtoken";
import { env } from "../../config/env";

export function decodeToken(token: string) {
  const userData = verify(token, env.accessSecret as string ) as {
    id: string;
    role: string;
  };
  return userData
}

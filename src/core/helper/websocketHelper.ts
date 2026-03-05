import { verify } from "jsonwebtoken";

export function decodeToken(token: string) {
  const userData = verify(token, process.env.ACCESS_SECRET as string) as {
    id: string;
    role: string;
  };
  return userData
}

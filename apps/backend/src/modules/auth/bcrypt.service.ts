import bcrypt from "bcrypt";
import { bcryptSalt } from "./auth.constants";

export class BcryptService {
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, bcryptSalt);
  }
  static async verifyPassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}

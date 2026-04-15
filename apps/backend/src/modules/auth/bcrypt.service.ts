import bcrypt from "bcryptjs";
import { bcryptSalt } from "./auth.constants.js";

export class BcryptService {
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, bcryptSalt);
  }
  static async verifyPassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}

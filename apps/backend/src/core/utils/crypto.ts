import crypto from "crypto";
import { env } from "../../config/env";
export type EncryptionType =  {
  iv: string;
  content: string;
  tag: string;
}
const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
const key = Buffer.from(env.encryptionKey!, "hex");

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag: authTag.toString("hex"),
  };
}

export function decrypt(encrypted: EncryptionType) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(encrypted.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));

  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

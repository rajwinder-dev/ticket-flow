import crypto from "crypto";
export type EncryptionType = {
  iv: string;
  content: string;
  tag: string;
};
const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
export class CryptoUtils {
  key: Buffer
  constructor(encryptionKey:string){
    this.key =  Buffer.from(encryptionKey, "hex");
  }
  encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, this.key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      iv: iv.toString("hex"),
      content: encrypted,
      tag: authTag.toString("hex"),
    };
  }
  decrypt(encrypted: EncryptionType) {
    const decipher = crypto.createDecipheriv(ALGO, this.key, Buffer.from(encrypted.iv, "hex"));
    decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));
    let decrypted = decipher.update(encrypted.content, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  
}

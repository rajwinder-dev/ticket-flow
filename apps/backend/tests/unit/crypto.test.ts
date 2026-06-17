import { CryptoUtils } from "@repo/utils";
import { describe, expect, it } from "vitest";

describe("CryptoUtils", () => {
  const encryptionKey =
    "125ccd8a2a116a559e3c8c8fa80bf573c2f37c0cc0dbc8e7c2019beee7f75a6e";
  const crypto = new CryptoUtils(encryptionKey);

  it("should encrypt and decrypt correctly", () => {
    const text = "hello world";

    const encrypted = crypto.encrypt(text);
    const decrypted = crypto.decrypt(encrypted);

    expect(decrypted).toBe(text);
  });

  it("should fail when ciphertext is tampered", () => {
    const text = "hello world";

    const encrypted = crypto.encrypt(text);

    // Tamper with content (simulate corruption)
    encrypted.content = encrypted.content.slice(0, -2) + "ff";

    expect(() => crypto.decrypt(encrypted)).toThrow();
  });

  it("should fail when auth tag is tampered", () => {
    const text = "hello world";

    const encrypted = crypto.encrypt(text);

    // Tamper with auth tag
    encrypted.tag = encrypted.tag.slice(0, -2) + "aa";

    expect(() => crypto.decrypt(encrypted)).toThrow();
  });
});

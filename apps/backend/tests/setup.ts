// tests/setup.ts
import { beforeAll, vi } from "vitest";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();
vi.mock("../../backend/src/modules/email/email.service.ts", () => ({
  EmailService: {
    sendSystemEmail: vi.fn().mockResolvedValue(true),
  },
}));

// Set NODE_ENV to test
process.env.NODE_ENV = "test";

beforeAll(() => {
  console.log("Global setup for Vitest: NODE_ENV =", process.env.NODE_ENV);
});

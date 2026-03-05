// tests/setup.ts
import { beforeAll } from "vitest";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();

// Set NODE_ENV to test
process.env.NODE_ENV = "test";

beforeAll(() => {
  console.log("Global setup for Vitest: NODE_ENV =", process.env.NODE_ENV);
});

import { Authorization, Salaries } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Salary Routes - Core + Edge Case Testing", () => {
  let employeeWithSalary: Salaries | null;
  let employeeWithSalaryAuth: Authorization | null;
  beforeAll(async () => {
    employeeWithSalary = await prisma.salaries.findFirst();
    employeeWithSalaryAuth = await prisma.authorization.findFirst({
      where: {
        id: employeeWithSalary?.employeeId,
      },
    });
    await tf.setup();
  });

  it("should create employee salary", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: 1000,
        allowance: 100,
        bonus: 100,
        deductions: 50,
        salaryType: "income",
        effectiveFrom: "2025-10-01",
        effectiveTo: "2025-11-01",
        note: "test string",
      },
      id: employeeWithSalary?.employeeId,
    });
  });

  it("should get all salary details", async () => {
    await tf.get({ path: "/salary" });
  });

  it("should get one employee salary details", async () => {
    await tf.get({
      path: "/salary",
      id: employeeWithSalary?.employeeId,
    });
  });

  it("should get salary summary", async () => {
    await tf.get({ path: "/salary/summary" });
  });

  // -----------------------------------------
  // 🚨 EDGE CASES
  // -----------------------------------------

  it("should reject missing fields", async () => {
    await tf.post({
      path: "/salary",
      data: {},
      id: employeeWithSalary?.employeeId,
      expectedStatus: 400,
    });
  });

  it("should reject negative base salary", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: -100,
        allowance: 50,
        bonus: 0,
        deductions: 0,
        salaryType: "income",
        effectiveFrom: "2025-10-01",
        effectiveTo: "2025-11-01",
        note: "negative base test",
      },
      id: employeeWithSalary?.employeeId,
      expectedStatus: 400,
    });
  });

  it("should reject invalid salaryType", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: 1000,
        allowance: 50,
        bonus: 0,
        deductions: 0,
        salaryType: "invalidType",
        effectiveFrom: "2025-10-01",
        effectiveTo: "2025-11-01",
        note: "invalid type test",
      },
      id: employeeWithSalary?.employeeId,
      expectedStatus: 400,
    });
  });

  it("should reject effectiveTo earlier than effectiveFrom", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: 1000,
        allowance: 100,
        bonus: 50,
        deductions: 20,
        salaryType: "income",
        effectiveFrom: "2025-12-01",
        effectiveTo: "2025-11-01", // 👈 invalid
        note: "reverse date",
      },
      id: employeeWithSalary?.employeeId,
      expectedStatus: 400,
    });
  });

  it("should reject extra unknown fields", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: 1200,
        allowance: 100,
        bonus: 0,
        deductions: 0,
        salaryType: "income",
        effectiveFrom: "2025-12-01",
        effectiveTo: "2026-01-01",
        note: "extra fields test",
        hackField: "should be rejected",
      },
      id: employeeWithSalary?.employeeId,
      expectedStatus: 400,
    });
  });

  it("should reject invalid employeeId", async () => {
    await tf.post({
      path: "/salary",
      data: {
        base: 1000,
        allowance: 50,
        bonus: 50,
        deductions: 20,
        salaryType: "income",
        effectiveFrom: "2025-10-01",
        effectiveTo: "2025-11-01",
        note: "bad ID",
      },
      id: 999999, // assume invalid
      expectedStatus: 404,
    });
  });

  // * fix later
  // it("should reject duplicate overlapping date range", async () => {
  //   await tf.post({
  //     path: "/salary",
  //     data: {
  //       base: 1500,
  //       allowance: 200,
  //       bonus: 50,
  //       deductions: 10,
  //       salaryType: "income",
  //       effectiveFrom: "2025-10-15", // overlaps with first one
  //       effectiveTo: "2025-10-30",
  //       note: "overlap test",
  //     },
  //     id: employee?.id,
  //     expectedStatus: 409, // Or whatever your app uses for conflict
  //   });
  // });
  it("should get self salary details ", async () => {
    await tf.get({ path: "/salary/me", expectedStatus: 200 });
  });

  it("should get self salary details", async () => {
    await tf.setup(employeeWithSalaryAuth?.username);
    await tf.get({ path: "/salary/me" });
  });
  afterAll(async () => {
    const lastSalary = await prisma.salaries.findFirst({
      orderBy: { id: "desc" },
    });
    if (lastSalary) {
      await prisma.salaries.delete({ where: { id: lastSalary.id } });
    }
  });
});

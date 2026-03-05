import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Testing Department module", () => {
  let departmentId: number;
  beforeAll(async () => {
    await tf.setup();
  });

  it("should create a department", async () => {
    const data = await tf.post({
      path: "/department",
      data: {
        department: "testDepartment",
        head: "testHead",
        description: "testDescription",
      },
    });
    departmentId = data.data.id;
  });

  it("should return duplicate error", async () => {
    await tf.post({
      path: "/department",
      data: {
        department: "testDepartment",
        head: "testHead",
        description: "testDescription",
      },
      expectedStatus: 409,
    });
  });

  it("should return error for invalid data", async () => {
    await tf.post({
      path: "/department",
      data: { department: 12345 }, // Invalid type
      expectedStatus: 400,
    });
  });

  it("should return error for missing required fields", async () => {
    await tf.post({
      path: "/department",
      data: {
        department: "MissingFieldsDept",
        // Missing head and description
      },
      expectedStatus: 400,
    });
  });

  it("should reject overly long department name", async () => {
    await tf.post({
      path: "/department",
      data: {
        department: "D".repeat(300), // Potentially exceeds DB length
        head: "Head",
        description: "Valid description",
      },
      expectedStatus: 400,
    });
  });

  it("should return all departments", async () => {
    await tf.get({
      path: "/department",
    });
  });

  it("should return 404 for non-existent department ID", async () => {
    await tf.get({
      path: "/department/999999",
      expectedStatus: 404,
    });
  });

  it("should return 400 for invalid ID on delete", async () => {
    await tf.delete({
      path: "/department",
      id: 999999,
      expectedStatus: 404,
    });
  });

  it("should soft delete department", async () => {
    await tf.delete({
      path: `/department`,
      id: departmentId,
    });
  });

  it("should return 404 when deleting already deleted department", async () => {
    await tf.delete({
      path: `/department`,
      id: departmentId,
      expectedStatus: 404,
    });
  });

  it("should not allow unauthenticated department creation", async () => {
    await tf.logout();
    await tf.post({
      path: "/department",
      data: {
        department: "Unauthorized",
        head: "NoHead",
        description: "Blocked without auth",
      },
      expectedStatus: 401,
    });
  });

  afterAll(async () => {
    await prisma.departments.delete({
      where: { department: "testDepartment" },
    });
  });
});

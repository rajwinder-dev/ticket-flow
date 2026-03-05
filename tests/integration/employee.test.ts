import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { getNewEmployeeData, testCatchAsync } from "../helper/testHelper";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();
beforeAll(async () => {
  await tf.setup();
});

describe("Employee Tests", () => {
  let employee: object;
  let employeeId: number;

  it("should create new employee", async () => {
    employee = await getNewEmployeeData();
    const data = await tf.post({
      path: "/employee",
      data: employee,
    });
    employeeId = data.data.id;
  });

  it("should return duplicate error", async () => {
    await tf.post({
      path: "/employee",
      data: employee,
      expectedStatus: 409,
    });
  });

  it("should return validation error", async () => {
    await tf.post({
      path: "/employee",
      data: {
        createdAt: "test@test.coom",
      },
      expectedStatus: 400,
    });
  });

  it("should get all employees", async () => {
    await tf.get({
      path: "/employee",
    });
  });

  it("should get specific employee", async () => {
    await tf.get({
      path: "/employee",
      id: employeeId,
    });
  });

  it("should return self details", async () => {
    await tf.get({
      path: "/employee/me",
    });
  });

  it("should return summary details", async () => {
    await tf.get({
      path: "/employee/summary",
    });
  });

  it("should soft delete employee", async () => {
    await tf.delete({
      path: "/employee",
      id: employeeId,
    });
  });

  // -------------------------
  // 🚨 EDGE CASE TESTS BELOW
  // -------------------------

  it("should return 404 for non-existent employee", async () => {
    await tf.get({
      path: "/employee",
      id: 999999, // assuming this ID doesn’t exist
      expectedStatus: 404,
    });
  });

  it("should return 400 for invalid ID type", async () => {
    await tf.get({
      path: "/employee",
      id: "invalid-id" as unknown as number,
      expectedStatus: 400,
    });
  });

  it("should reject overly long input fields", async () => {
    await tf.post({
      path: "/employee",
      data: {
        ...(await getNewEmployeeData()),
        name: "a".repeat(300),
      },
      expectedStatus: 400,
    });
  });

  it("should not allow employee creation with missing required fields", async () => {
    await tf.post({
      path: "/employee",
      data: {},
      expectedStatus: 400,
    });
  });

  // it("should not allow duplicate email (case-insensitive)", async () => {
  //   const newEmployee = await getEmployeeData();
  //   newEmployee.email = employee?.email?.toUpperCase();

  //   await tf.post({
  //     path: "/employee",
  //     data: newEmployee,
  //     expectedStatus: 409,
  //   });
  // });

  it("should return 400 on delete with invalid ID", async () => {
    await tf.delete({
      path: "/employee",
      id: "abc" as unknown as number,
      expectedStatus: 400,
    });
  });

  it("should return 404 on deleting non-existent employee", async () => {
    await tf.delete({
      path: "/employee",
      id: 999999,
      expectedStatus: 404,
    });
  });

  it("should not return soft-deleted employee", async () => {
    await tf.get({
      path: "/employee",
      id: employeeId,
      expectedStatus: 404,
    });
  });
  afterAll(async () => {
    testCatchAsync(async () => {
      await prisma.employees.delete({
        where: {
          id: employeeId,
        },
      });
    });
  });
});

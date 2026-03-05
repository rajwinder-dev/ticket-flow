import { addDays } from "date-fns";
import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Goal Routes - Core & Edge Case Tests", () => {
  let employeeId: number | undefined;
  let goalId: number;

  beforeAll(async () => {
    await tf.setup();
    const roleData = await prisma.roles.findUnique({
      where: {
        name: "manager",
      },
      include: {
        Authorization: true,
      },
    });
    employeeId = roleData?.Authorization[0].employeeId;
  });

  it("should create and assign goal", async () => {
    const data = await tf.post({
      path: "/goal",
      id: employeeId,
      data: {
        goal: "this is the test goal",
        deadline: addDays(new Date(), 2),
      },
    });
    goalId = data.data.id;
  });

  it("should update assigned goal", async () => {
    await tf.patch({
      path: "/goal",
      id: goalId,
      data: {
        goal: "this is the test goal updated",
        deadline: addDays(new Date(), 2),
      },
    });
  });

  it("should get all goals", async () => {
    await tf.get({
      path: "/goal",
    });
  });

  it("should get one specific goal", async () => {
    await tf.get({
      path: "/goal",
      id: goalId,
    });
  });

  it("should get goal summary", async () => {
    await tf.get({
      path: "/goal/summary",
    });
  });

  it("should soft delete assigned goal", async () => {
    await tf.delete({
      path: "/goal",
      id: goalId,
    });
  });

  // -----------------------------------------
  // 🚨 EDGE CASES BELOW - Important to test
  // -----------------------------------------

  it("should return 404 for non-existent goal ID", async () => {
    await tf.get({
      path: "/goal",
      id: 999999,
      expectedStatus: 404,
    });
  });

  it("should return 400 for invalid goal ID type", async () => {
    await tf.get({
      path: "/goal",
      id: "abc" as unknown as number,
      expectedStatus: 400,
    });
  });

  it("should reject creation with past deadline", async () => {
    await tf.post({
      path: "/goal",
      id: employeeId,
      data: {
        goal: "should fail",
        deadline: addDays(new Date(), -1),
      },
      expectedStatus: 400,
    });
  });

  it("should reject goal with overly long text", async () => {
    await tf.post({
      path: "/goal",
      id: employeeId,
      data: {
        goal: "a".repeat(300),
        deadline: addDays(new Date(), 2),
      },
      expectedStatus: 400,
    });
  });

  it("should return 400 when missing required fields", async () => {
    await tf.post({
      path: "/goal",
      id: employeeId,
      data: {},
      expectedStatus: 400,
    });
  });

  it("should return 404 when deleting already deleted goal", async () => {
    await tf.delete({
      path: "/goal",
      id: goalId,
      expectedStatus: 404,
    });
  });

  it("should not allow update on soft-deleted goal", async () => {
    await tf.patch({
      path: "/goal",
      id: goalId,
      data: {
        goal: "won't update",
        deadline: addDays(new Date(), 5),
      },
      expectedStatus: 404,
    });
  });

  it("should reject deletion with invalid ID", async () => {
    await tf.delete({
      path: "/goal",
      id: "fake" as unknown as number,
      expectedStatus: 400,
    });
  });

  it("should reject goal creation without employeeId", async () => {
    await tf.post({
      path: "/goal",
      data: {
        goal: "missing employee",
        deadline: addDays(new Date(), 3),
      },
      expectedStatus: 404,
    });
  });

  afterAll(async () => {
    // await prisma.goal.deleteMany({
    //   where: { id: goalId },
    // });
  });
});

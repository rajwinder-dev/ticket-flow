import { addDays } from "date-fns";
import { testFactory } from "../helper/testFactory";
import { prisma } from "../../src/core/utils/prismaClient";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Leave Routes - Core & Edge Case Tests", () => {
  let leaveId: number;
  let employeeId: number | undefined;

  beforeAll(async () => {
    await tf.setup();
    const data = await prisma.leave.findFirst();
    employeeId = data?.employeeId;
  });

  it("should create a leave", async () => {
    const data = await tf.post({
      path: "/leave/me",
      data: {
        leaveType: "sick",
        startDate: addDays(new Date(), 2),
        endDate: addDays(new Date(), 4),
        reason: "test leave test",
      },
    });
    leaveId = data.data.id;
  });

  it("should update leave data", async () => {
    await tf.patch({
      path: "/leave",
      id: leaveId,
      data: {
        status: "rejected",
      },
    });
  });

  it("should return self leaves", async () => {
    await tf.get({
      path: "/leave/me",
    });
  });

  it("should return all leaves", async () => {
    await tf.get({
      path: "/leave",
    });
  });

  it("should return leave data of employee", async () => {
    await tf.get({
      path: "/leave",
      id: employeeId,
    });
  });

  it("should return leaves summary", async () => {
    await tf.get({
      path: "/leave/summary",
    });
  });

  // ----------------------------------------
  // 🚨 Edge Case Tests Below
  // ----------------------------------------

  it("should not allow endDate before startDate", async () => {
    await tf.post({
      path: "/leave/me",
      data: {
        leaveType: "casual",
        startDate: addDays(new Date(), 5),
        endDate: addDays(new Date(), 3),
        reason: "end before start",
      },
      expectedStatus: 400,
    });
  });

  it("should not allow leave with a past date", async () => {
    await tf.post({
      path: "/leave/me",
      data: {
        leaveType: "casual",
        startDate: addDays(new Date(), -2),
        endDate: addDays(new Date(), -1),
        reason: "past leave",
      },
      expectedStatus: 400,
    });
  });

  it("should not allow overly long reason text", async () => {
    await tf.post({
      path: "/leave/me",
      data: {
        leaveType: "casual",
        startDate: addDays(new Date(), 1),
        endDate: addDays(new Date(), 2),
        reason: "a".repeat(1000),
      },
      expectedStatus: 400,
    });
  });

  it("should return 404 when updating non-existent leave", async () => {
    await tf.patch({
      path: "/leave",
      id: 999999,
      data: {
        status: "approved",
      },
      expectedStatus: 404,
    });
  });

  it("should return 400 when invalid leave ID is passed for update", async () => {
    await tf.patch({
      path: "/leave",
      id: "bad-id" as unknown as number,
      data: {
        status: "rejected",
      },
      expectedStatus: 400,
    });
  });

  it("should not allow invalid leave status", async () => {
    await tf.patch({
      path: "/leave",
      id: leaveId,
      data: {
        status: "banana", // assuming only 'pending', 'approved', 'rejected' are allowed
      },
      expectedStatus: 400,
    });
  });

  it("should not allow creation with missing required fields", async () => {
    await tf.post({
      path: "/leave/me",
      data: {},
      expectedStatus: 400,
    });
  });

  it("should not allow leave type that’s not in enum", async () => {
    await tf.post({
      path: "/leave/me",
      data: {
        leaveType: "alien-leave",
        startDate: addDays(new Date(), 2),
        endDate: addDays(new Date(), 3),
        reason: "just testing",
      },
      expectedStatus: 400,
    });
  });

  afterAll(async () => {
    await prisma.leave.deleteMany({
      where: {
        id: leaveId,
      },
    });
  });
});

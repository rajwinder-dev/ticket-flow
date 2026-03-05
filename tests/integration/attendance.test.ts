import { startOfDay } from "date-fns";
import { Attendance } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { testCatchAsync } from "../helper/testHelper";
import { testFactory } from "../helper/testFactory";
import { describe, it, beforeAll, afterAll } from "vitest";

const tf = new testFactory();

describe("test attendance table", () => {
  let attend: Attendance | null;
  beforeAll(async () => {
    await tf.setup();
    await testCatchAsync(async () => {
      const attendData = await prisma.attendance.findMany();
      attend = attendData[Math.floor(attendData.length / 2)];
      await prisma.attendance.deleteMany({
        where: {
          checkIn: {
            gte: startOfDay(new Date()),
          },
        },
      });
    });
  });

  it("should mark attendance check-in", async () => {
    await tf.post({
      path: "/attend",
      expectedStatus: 201,
    });
  });

  it("should mark attendance checkout", async () => {
    await tf.post({
      path: "/attend",
      expectedStatus: 201,
    });
  });

  it("should return conflict when trying to check-out again", async () => {
    await tf.post({
      path: "/attend",
      expectedStatus: 409,
    });
  });

  it("should return all attendance records", async () => {
    await tf.get({
      path: "/attend",
      expectedStatus: 200,
    });
  });

  it("should return attendance records for a specific employee", async () => {
    await tf.get({
      path: "/attend",
      id: attend?.employeeId,
      expectedStatus: 200,
    });
  });

  it("should return error for non-existent employee", async () => {
    await tf.get({
      path: "/attend",
      id: 999999, // unlikely to exist
      expectedStatus: 404,
    });
  });

  it("should return summary of today’s attendance", async () => {
    await tf.get({
      path: "/attend/summary",
      expectedStatus: 200,
    });
  });

  it("should return current employee’s attendance history", async () => {
    await tf.get({
      path: "/attend/me",
      expectedStatus: 200,
    });
  });

  it("should return 404 on invalid endpoint", async () => {
    await tf.get({
      path: "/attend/invalid",
      expectedStatus: 400,
    });
  });

  it("should fail to check-in without authentication (if protected)", async () => {
    await tf.logout();
    await tf.post({
      path: "/attend",
      expectedStatus: 401,
    });
  });

  afterAll(async () => {
    await testCatchAsync(async () => {
      const data = await prisma.attendance.findFirst({
        orderBy: {
          id: "desc",
        },
      });
      if (data?.id) {
        await prisma.attendance.delete({
          where: { id: data.id },
        });
      }
    }, true);
  });
});

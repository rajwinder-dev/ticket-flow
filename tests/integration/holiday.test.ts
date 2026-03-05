import { lastDayOfWeek } from "date-fns";
import { testFactory } from "../helper/testFactory";
import { prisma } from "../../src/core/utils/prismaClient";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Holiday Route Tests with Edge Cases", () => {
  let holidayId: number;
  const date = lastDayOfWeek(new Date());

  beforeAll(async () => {
    await tf.setup();
  });

  it("should create a holiday", async () => {
    const data = await tf.post({
      path: "/holiday",
      data: {
        name: "testHoliday",
        description: "this is the test holiday",
        date,
      },
    });
    holidayId = data.data.id;
  });

  it("should return duplicate error", async () => {
    await tf.post({
      path: "/holiday",
      data: {
        name: "testHoliday",
        description: "this is the test holiday",
        date,
      },
      expectedStatus: 409,
    });
  });

  it("should return all holidays", async () => {
    await tf.get({
      path: "/holiday",
    });
  });

  it("should return holiday summary", async () => {
    await tf.get({
      path: `/holiday/summary`,
    });
  });

  it("should soft delete holiday", async () => {
    await tf.delete({
      path: `/holiday`,
      id: holidayId,
    });
  });

  // ----------------------------------------
  // 🚨 Edge Case Tests Begin Here
  // ----------------------------------------

  it("should return 404 for non-existent holiday", async () => {
    await tf.get({
      path: "/holiday",
      id: 999999,
      expectedStatus: 404,
    });
  });

  it("should return 404 for invalid holiday ID", async () => {
    await tf.get({
      path: "/holiday",
      id: "invalid" as unknown as number,
      expectedStatus: 404,
    });
  });

  it("should not allow overly long name or description", async () => {
    await tf.post({
      path: "/holiday",
      data: {
        name: "a".repeat(300),
        description: "b".repeat(1000),
        date,
      },
      expectedStatus: 400,
    });
  });

  it("should reject missing fields (name, date)", async () => {
    await tf.post({
      path: "/holiday",
      data: {
        description: "missing fields",
      },
      expectedStatus: 400,
    });
  });

  it("should reject invalid date format", async () => {
    await tf.post({
      path: "/holiday",
      data: {
        name: "InvalidDateHoliday",
        description: "invalid date test",
        date: "not-a-date",
      },
      expectedStatus: 400,
    });
  });

  it("should not allow past date if restricted", async () => {
    await tf.post({
      path: "/holiday",
      data: {
        name: "PastHoliday",
        description: "testing past date",
        date: new Date("2000-01-01"),
      },
      expectedStatus: 400,
    });
  });

  it("should return 404 when deleting already deleted holiday", async () => {
    await tf.delete({
      path: "/holiday",
      id: holidayId,
      expectedStatus: 404,
    });
  });

  it("should reject deletion with invalid ID type", async () => {
    await tf.delete({
      path: "/holiday",
      id: "bad-id" as unknown as number,
      expectedStatus: 400,
    });
  });

  afterAll(async () => {
    await prisma.holidays.deleteMany({
      where: {
        id: holidayId,
      },
    });
  });
});

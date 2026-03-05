import { Announcements } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe, expect, it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("should test announcements", () => {
  let announcementId: number | undefined;

  beforeAll(async () => {
    await tf.setup();
  });

  it("should fail to create announcement with missing fields", async () => {
    await tf.post({
      path: "/announcement",
      data: {
        title: "", // empty title
        description: "Only desc provided",
      },
      expectedStatus: 400,
    });
  });

  it("should fail to create announcement with invalid type", async () => {
    await tf.post({
      path: "/announcement",
      data: {
        title: "Invalid type",
        description: "invalid enum value",
        type: "invalid",
        target: "admin",
      },
      expectedStatus: 400,
    });
  });

  it("should create announcement", async () => {
    const data = await tf.post({
      path: "/announcement",
      data: {
        title: "this is test announcement",
        description: "send for testing purpose",
        type: "role",
        target: "admin",
      },
      expectedStatus: 201, // optionally enforce expected
    });
    expect(data.data).toHaveProperty("id");
    expect(data.data.title).toBe("this is test announcement");
    expect(data.data).toMatchObject({
      title: "this is test announcement",
      description: "send for testing purpose",
      type: "role",
      target: "admin",
    });
    announcementId = data.data.id;
  });

  it("should get all announcements", async () => {
    const data = await tf.get({
      path: "/announcement",
      expectedStatus: 200,
    });
    expect(Array.isArray(data.data)).toBe(true);
    data.data.forEach((item: Announcements) => {
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("target");
    });
  });

  it("should get self announcements", async () => {
    await tf.get({
      path: "/announcement/me",
      expectedStatus: 200,
    });
  });

  it("should fail to get announcements with invalid path", async () => {
    await tf.get({
      path: "/announcement/unknown",
      expectedStatus: 404,
    });
  });

  afterAll(async () => {
    if (announcementId) {
      await prisma.announcements.delete({
        where: {
          id: announcementId,
        },
      });
    }
  });
});

import { prisma } from "../../src/core/utils/prismaClient";
import WebSocket from "ws";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testFactory } from "../helper/testFactory";
import { getNewEmployeeData } from "../helper/testHelper";
const user1 = new testFactory();
const user2 = new testFactory();

describe("should test notifications", () => {
  let port!: number;
  let token2: string | null = null;
  beforeAll(async () => {
    const admin2 = await prisma.authorization.findFirst({
      where: {
        Roles: {
          name: "admin",
        },
        username: {
          not: "rajwinder",
        },
      },
    });
    await user1.setup();
    token2 = await user2.setup(admin2?.username);
    port = await user2.setupSocket();
  });
  it("should create an employee and client2 should get notified", async () => {
    const client2 = new WebSocket(`ws://localhost:${port}?token=${token2}`);

    // Step 1: Wait for the WebSocket to connect
    await new Promise<void>((resolve, reject) => {
      client2.on("open", () => {
        console.log("WebSocket connected");
        resolve();
      });
      client2.on("error", reject);
    });

    // Step 2: Set up listener *after* connection is open
    const messagePromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timed out waiting for notification message"));
      }, 3000);
      client2.on("message", (data) => {
        clearTimeout(timeout);
        try {
          const message = JSON.parse(data.toString());
          expect(message.type).toBe("notification");
          resolve();
          client2.close();
        } catch (err) {
          reject(err);
        } finally {
        }
      });

      client2.on("error", reject);
      client2.on("close", (code) => {
        if (code !== 1000)
          console.warn("WebSocket closed unexpectedly. Code:", code);
      });
    });

    // Step 3: Trigger the action
    const employee = await getNewEmployeeData();
    const response = await user1.post({
      path: "/employee",
      data: employee,
    });
    console.log("employee created: " + response.status);
    // Step 4: Wait for WebSocket notification
    await messagePromise;
  });

  // it("should get all notification self", async () => {
  //   await user1.get({
  //     path: "/notify",
  //   });
  // });
  afterAll(async () => {
    await user2.closeSocket();
  });
});

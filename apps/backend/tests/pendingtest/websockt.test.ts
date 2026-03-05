// tests/testModules/websockt.test.ts
import WebSocket from "ws";
import { testFactory } from "../helper/testFactory";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

describe("WebSocket auth connection", () => {
  let port!: number;
  let token: string | null;
  const tf = new testFactory();

  beforeAll(async () => {
    token = await tf.setup();
    if (!token) throw "token is undefined";
    port = await tf.setupSocket();
  });

  afterAll(async () => {
    await tf.closeSocket();
  });

  test("should connect with valid token", (done) => {
    const client = new WebSocket(`ws://localhost:${port}?token=${token}`);

    client.onopen = () => {
      client.onmessage = (msg) => {
        expect(msg.data).toBe("Connected!");
        client.close();
        done();
      };
    };

    client.onerror = (err) => {
      done(err);
    };
  });

  test("should disconnect with invalid token", (done) => {
    const client = new WebSocket(`ws://localhost:${port}?token=invalid-token`);

    client.on("close", (code) => {
      try {
        expect(code).toBe(4001);
        done();
      } catch (err) {
        done(err);
      }
    });

    client.on("error", (err) => {
      // Log the error, but don't fail the test here
      console.error("WebSocket error:", err);
    });
  });
  afterAll(async () => {
    tf.closeSocket();
  });
});

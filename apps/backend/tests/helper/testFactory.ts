import { endpoint } from "./utils";
import request from "supertest";
import app from "../../src/app";
import { server, wss } from "../../src/server";
import { AddressInfo } from "ws";
import { Request } from "express";
import { expect } from "vitest";
const toggleLogs = process.env.LOGS === "true";
interface props {
  path: string;
  data?: object;
  expectedStatus?: number;
  id?: number;
}

export class testFactory {
  token: string | null = null;
  cookie: string | null = null;
  port!: number;
  logs?: boolean;
  constructor() {
    this.logs = toggleLogs;
  }
  async setup(
    username: string = "rajwinder",
    password: string = "user"
  ): Promise<string | null> {
    const loginPath = "/api/v1/auth/login";
    const res = await request
      .agent(app)
      .post(loginPath)
      .send({ username, password });
    if (res.statusCode !== 200) throw console.log(res.body);
    this.token = res.body.data.accessToken;

    const setCookie = res.headers["set-cookie"];
    if (Array.isArray(setCookie)) {
      this.cookie =
        setCookie.find((c) => c.startsWith("refreshToken=")) || null;
    }
    if (this.logs)
      this.logOutput("POST", loginPath, { username, password }, res.body, true);
    return this.token;
  }
  async logout(expectedStatus = 200) {
    const logoutPath = "/api/v1/auth/logout";
    if (!this.token || !this.cookie) {
      throw new Error(
        "Cannot logout: token or cookie is missing. Did you forget to call setup()?"
      );
    }

    const res = await request
      .agent(app)
      .post(logoutPath)
      .set("Authorization", `Bearer ${this.token}`)
      .set("Cookie", this.cookie);

    if (res.status !== expectedStatus) {
      console.error("Logout failed response:", { Output: res.body });
    }
    try {
      if (this.logs)
        this.logOutput("POST", logoutPath, "Logout user", res.body, true);
      expect(res.status).toBe(expectedStatus);
    } catch (err) {
      this.logOutput("POST", logoutPath, "Logout user", res.body);
      throw err;
    }
  }
  async post({ path, data, expectedStatus = 201, id }: props) {
    let fullPath = `${endpoint}${path}`;
    if (id) {
      fullPath += `/${id}`;
    }
    const res = await request
      .agent(app)
      .post(fullPath)
      .send(data)
      .set("Authorization", `Bearer ${this.token}`);
    try {
      if (this.logs) this.logOutput("POST", fullPath, data, res.body, true);
      expect(res.statusCode).toBe(expectedStatus);
    } catch (err) {
      this.logOutput("POST", fullPath, data, res.body);
      throw err;
    }
    return res.body;
  }
  async patch({ path, data, expectedStatus = 200, id }: props) {
    let fullPath = `${endpoint}${path}`;
    if (id) {
      fullPath += `/${id}`;
    }
    const res = await request
      .agent(app)
      .patch(fullPath)
      .send(data)
      .set("Authorization", `Bearer ${this.token}`);
    try {
      if (this.logs) this.logOutput("PATCH", fullPath, data, res.body, true);
      expect(res.statusCode).toBe(expectedStatus);
    } catch (err) {
      this.logOutput("PATCH", fullPath, data, res.body);
      throw err;
    }
    return res.body;
  }
  async get({ path, expectedStatus = 200, id }: props) {
    let fullPath = `${endpoint}${path}`;
    if (id) {
      fullPath += `/${id}`;
    }
    const res = await request
      .agent(app)
      .get(fullPath)
      .set("Authorization", `Bearer ${this.token}`);
    try {
      if (this.logs) this.logOutput("GET", fullPath, null, res.body, true);
      expect(res.statusCode).toBe(expectedStatus);
    } catch (err) {
      this.logOutput("GET", fullPath, null, res.body);
      throw err;
    }

    return res.body;
  }
  async delete({ path, expectedStatus = 204, id }: props) {
    let fullPath = `${endpoint}${path}`;
    if (id) {
      fullPath += `/${id}`;
    }
    const res = await request
      .agent(app)
      .delete(fullPath)
      .set("Authorization", `Bearer ${this.token}`);
    try {
      if (this.logs) this.logOutput("DELETE", fullPath, null, res.body, true);
      expect(res.statusCode).toBe(expectedStatus);
    } catch (err) {
      this.logOutput("DELETE", fullPath, null, res.body);
      throw err;
    }
    return res.body;
  }
  // * websockets functions
  async setupSocket(): Promise<number> {
    wss.on("connection", (ws: WebSocket, req: Request) => {
      const url = new URL(req.url || "/", "http://localhost");
      const token = url.searchParams.get("token");

      if (token !== "valid-token") {
        ws.close(4001, "Unauthorized");
      } else {
        ws.send("Connected!");
      }
    });
    return new Promise((resolve, reject) => {
      server.listen(0, () => {
        this.port = (server.address() as AddressInfo).port;
        resolve(this.port);
      });

      server.on("error", reject);
    });
  }
  closeSocket(): Promise<void> {
    return new Promise((resolve) => {
      wss.close(() => {
        server.close(() => resolve());
      });
    });
  }
  logOutput(
    requestType: string,
    fullPath: string,
    input?: object | null | string,
    output?: object | null,
    success?: boolean
  ) {
    const infoString = success
      ? `${requestType} ✅ ${fullPath} ✅\n`
      : `${requestType} ❌ ${fullPath} ❌\n`;
    const inputString = input
      ? `Input:\n${JSON.stringify(input, null, 2)}\n`
      : "";
    const outputString = output
      ? `Output:\n${JSON.stringify(output, null, 2)}\n`
      : "";
    console.log(
      infoString + inputString + outputString + `TimeStamp: ${new Date()}`
    );
  }
}

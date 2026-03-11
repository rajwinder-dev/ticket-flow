import {agent} from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { User } from "../../generated/prisma";
import app from "../../src/app";
import { prisma } from "../../src/core/utils/prismaClient";
import { createRandomUser } from "../helper/testHelper";

describe("testing auth routes", () => {
  let accessToken: string;
  let auth: { user: User; password: string };
  const api = agent(app);

  beforeAll(async () => {
    auth = await createRandomUser();
  });

  it("should fail to login with wrong password", async () => {
    const res = await api.post("/api/v1/auth/login").send({
      email: auth.user?.email,
      password: "wrong_password",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should fail to login with missing email", async () => {
    const res = await api.post("/api/v1/auth/login").send({
      password: "user",
    });
    expect(res.statusCode).toBe(400);
  });

  it("should login successfully", async () => {
    const res = await api.post("/api/v1/auth/login").send({
      email: auth.user?.email,
      password: auth.password,
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.data.accessToken;
  });
  it("should should  refresh token ", async () => {
    const res = await api.get("/api/v1/auth/refresh-token");
    expect(res.statusCode).toBe(200);
    accessToken = res.body.data.accessToken;
  });
  it("should fail to change password with wrong current password", async () => {
    const res = await api
      .patch("/api/v1/auth/change-password")
      .send({
        currentPassword: "wrong",
        password: "newuser",
        confirmPassword: "newuser",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should fail to change password with mismatched confirm password", async () => {
    const res = await api
      .patch("/api/v1/auth/change-password")
      .send({
        currentPassword: auth.password,
        password: "newuser",
        confirmPassword: "differentPassword",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should change password with correct credentials", async () => {
    const res = await api
      .patch("/api/v1/auth/change-password")
      .send({
        currentPassword: auth.password,
        password: "user",
        confirmPassword: "user",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get user profile with invalid token", async () => {
    const res = await api.get("/api/v1/auth/profile").set("Authorization", `Bearer invalidToken`);
    expect(res.statusCode).toBe(401);
  });

  it("should fail to get user info without token", async () => {
    const res = await api.get("/api/v1/auth/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should login again after logout", async () => {
    const res = await api.post("/api/v1/auth/login").send({
      email: auth.user?.email,
      password: "user",
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.data.accessToken;
  });

  it("should logout account", async () => {
    const res = await api
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to logout with invalid token", async () => {
    const res = await api.post("/api/v1/auth/logout").set("Authorization", `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
  });

  it("should fail to logout without token", async () => {
    const res = await api.post("/api/v1/auth/logout");
    expect(res.statusCode).toBe(401);
  });

  // it("should fail to logout without cookie", async () => {
  //   const res = await request
  //     .agent(app)
  //     .post("/api/v1/auth/logout")
  //     .set("Authorization", `Bearer ${accessToken}`);
  //   expect(res.statusCode).toBe(400);
  // });
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        username: auth.user?.id,
      },
    });

  });
});

import { faker } from "@faker-js/faker";
import { agent } from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../src/app";
import { prisma } from "../../src/core/utils/prismaClient";
import { authenticateUser } from "../helper/auth";
import { User } from "../../src/generated/client";

describe("User Routers", async () => {
  const api = agent(app);

  let accessToken: string;
  let user: User;

  beforeAll(async () => {
    const auth = await authenticateUser(api);
    accessToken = auth.accessToken;
    user = auth.user;
  });

  afterAll(async () => {
    await prisma.organization.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: user.id },
    });
  });

  it("should onboard user successfully", async () => {
    const res = await api
      .post("/api/v1/user/onBoard")
      .send({
        user: {
          location: faker.location.streetAddress(),
        },
        organization: {
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          teamSize: faker.number.int({ min: 5, max: 100 }),
        },
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
  });

  it("should fail if organization name is missing", async () => {
    const res = await api
      .post("/api/v1/user/onBoard")
      .send({
        user: {
          location: faker.location.streetAddress(),
        },
        organization: {
          description: faker.company.catchPhrase(),
          teamSize: 10,
        },
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it("should fail if teamSize is not a number", async () => {
    const res = await api
      .post("/api/v1/user/onBoard")
      .send({
        user: {
          location: faker.location.streetAddress(),
        },
        organization: {
          name: faker.company.name(),
          teamSize: "large",
        },
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it("should fail if request body is empty", async () => {
    const res = await api
      .post("/api/v1/user/onBoard")
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it("should fail if organization object missing", async () => {
    const res = await api
      .post("/api/v1/user/onBoard")
      .send({
        user: {
          location: faker.location.streetAddress(),
        },
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });
});

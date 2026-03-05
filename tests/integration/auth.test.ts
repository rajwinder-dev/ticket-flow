import { Authorization } from "../../generated/prisma";
import app from "../../src/app";
import request from "supertest";
import { prisma } from "../../src/core/utils/prismaClient";
import { faker } from "@faker-js/faker";
import { testCatchAsync } from "../helper/testHelper";
import { describe, expect, it , beforeAll, afterAll} from "vitest";

describe("testing auth routes", () => {
  let accessToken: string;
  let refreshToken: string;
  let authData: Authorization | null;

  beforeAll(async () => {
    const role = await prisma.roles.findFirst({
      where: {
        name: "admin",
      },
    });
    if (!role) throw "No role found";

    const department = await prisma.departments.findFirst({
      where: {
        department: "administration",
      },
    });
    if (!department) throw "No department found";
    await testCatchAsync(async () => {
      const newEmployee = await prisma.employees.create({
        data: {
          createdAt: new Date(),
          uuid: String(faker.finance.creditCardNumber()),
          gender: faker.person.sex(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          nationalId: faker.string.numeric({ length: { min: 5, max: 10 } }),
          idType: "passport",
          email: faker.internet.email(),
          phoneNumber: faker.string.numeric(10),
          dateOfBirth: faker.date.birthdate(),
          address: faker.location.streetAddress(),
          hireDate: faker.date.past(),
          jobTitle: "admin",
          description: "new employee",
          departmentId: department?.id,
        },
      });
      if (!newEmployee) throw "No employee found";
      authData = await prisma.authorization.create({
        data: {
          username: `${newEmployee.firstName}${newEmployee.lastName}`,
          password:
            "$2a$12$sgeo0uQSAGy4gKAMnh1ET.MG4BinlMO/5vblUnPDgldRdqakxRoWK",
          employeeId: newEmployee.id,
          roleId: role.id,
        },
      });
    });
  });

  it("should fail to login with wrong password", async () => {
    const res = await request.agent(app).post("/api/v1/auth/login").send({
      username: authData?.username,
      password: "wrong_password",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/password or username is invalid/i);
  });

  it("should fail to login with missing username", async () => {
    const res = await request.agent(app).post("/api/v1/auth/login").send({
      password: "user",
    });
    expect(res.statusCode).toBe(400);
  });

  it("should login successfully", async () => {
    const res = await request.agent(app).post("/api/v1/auth/login").send({
      username: authData?.username,
      password: "user",
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.data.accessToken;

    const setCookie = res.headers["set-cookie"];
    if (Array.isArray(setCookie)) {
      refreshToken = setCookie.find((cookie) =>
        cookie.startsWith("refreshToken=")
      ) as string;
    } else {
      throw new Error("No cookies returned");
    }
  });

  it("should fail to change password with wrong current password", async () => {
    const res = await request
      .agent(app)
      .patch("/api/v1/auth/changePassword")
      .send({
        currentPassword: "wrong",
        password: "newuser",
        confirmPassword: "newuser",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should fail to change password with mismatched confirm password", async () => {
    const res = await request
      .agent(app)
      .patch("/api/v1/auth/changePassword")
      .send({
        currentPassword: "user",
        password: "newuser",
        confirmPassword: "differentPassword",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
  });

  it("should change password with correct credentials", async () => {
    const res = await request
      .agent(app)
      .patch("/api/v1/auth/changePassword")
      .send({
        currentPassword: "user",
        password: "user",
        confirmPassword: "user",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get user info with invalid token", async () => {
    const res = await request
      .agent(app)
      .get("/api/v1/employee/me")
      .set("Authorization", `Bearer invalidtoken`);
    expect(res.statusCode).toBe(401);
  });

  it("should fail to get user info without token", async () => {
    const res = await request.agent(app).get("/api/v1/employee/me");
    expect(res.statusCode).toBe(401);
  });

  it("should login again after logout", async () => {
    const res = await request.agent(app).post("/api/v1/auth/login").send({
      username: authData?.username,
      password: "user",
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.data.accessToken;
  });

  it("should logout account", async () => {
    const res = await request
      .agent(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Cookie", refreshToken);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to logout with invalid token", async () => {
    const res = await request
      .agent(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer invalidtoken`)
      .set("Cookie", refreshToken);

    expect(res.statusCode).toBe(401);
  });

  it("should fail to logout without token", async () => {
    const res = await request
      .agent(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", refreshToken);
    expect(res.statusCode).toBe(401);
  });

  it("should fail to logout without cookie", async () => {
    const res = await request
      .agent(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(400);
  });
  afterAll(async () => {
    await testCatchAsync(async () => {
      await prisma.authorization.deleteMany({
        where: {
          username: authData?.username,
        },
      });
      await prisma.employees.deleteMany({
        where: {
          id: authData?.employeeId,
        },
      });
    });
  });
});

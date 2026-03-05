import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { getRoleId } from "../helper/testHelper";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Role Routes - Core & Edge Case Tests", () => {
  let roleId: number;

  beforeAll(async () => {
    await tf.setup();
  });

  // ✅ Basic flow
  it("should create a role", async () => {
    const data = await tf.post({
      path: "/role",
      data: {
        name: "testRole",
        description: "Added for testing purpose",
      },
    });
    roleId = data.data.id;
  });

  it("should update role description", async () => {
    await tf.patch({
      path: "/role",
      id: roleId,
      data: {
        description: "Updated test description",
      },
      expectedStatus: 200,
    });
  });

  it("should return duplicate error", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: "testRole",
        description: "Another attempt",
      },
      expectedStatus: 409,
    });
  });

  it("should return invalid error (wrong schema)", async () => {
    await tf.post({
      path: "/role",
      data: { role: 12345 },
      expectedStatus: 400,
    });
  });

  it("should return all roles", async () => {
    await tf.get({
      path: "/role",
    });
  });

  it("should soft delete role", async () => {
    await tf.delete({
      path: `/role`,
      id: await getRoleId(),
    });
  });

  // ------------------------------------------
  // 🚨 Edge Case Tests
  // ------------------------------------------

  it("should not create role with empty name", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: "",
        description: "empty name test",
      },
      expectedStatus: 400,
    });
  });

  it("should not create role with too long name", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: "a".repeat(101),
        description: "Too long role name",
      },
      expectedStatus: 400,
    });
  });

  it("should not update non-existent role", async () => {
    await tf.patch({
      path: "/role",
      id: 999999,
      data: {
        description: "non-existent update",
      },
      expectedStatus: 404,
    });
  });

  it("should not delete non-existent role", async () => {
    await tf.delete({
      path: "/role",
      id: 999999,
      expectedStatus: 404,
    });
  });

  it("should not accept extra fields (strict schema)", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: "strictRole",
        description: "testing strict",
        extraField: "unauthorized field",
      },
      expectedStatus: 400,
    });
  });

  it("should reject role creation without description", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: "missingDescription",
      },
      expectedStatus: 400,
    });
  });

  it("should reject if name is not a string", async () => {
    await tf.post({
      path: "/role",
      data: {
        name: 123,
        description: "type error",
      },
      expectedStatus: 400,
    });
  });

  afterAll(async () => {
    try {
      await prisma.roles.delete({
        where: {
          id: roleId,
        },
      });
    } catch {
      console.log("Role cleanup failed");
    }
  });
});

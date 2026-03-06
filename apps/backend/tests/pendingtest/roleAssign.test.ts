import { faker } from "@faker-js/faker";
import { testFactory } from "../helper/testFactory";
import { Employees, Roles } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { testCatchAsync } from "../helper/testHelper";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Role Assignment Route - Core + Edge Case Tests", () => {
  let newEmployee: Employees | null;
  let role: Roles | null;
  beforeAll(async () => {
    await tf.setup();
    role = await prisma.roles.findFirst({
      where: {
        name: "employee",
      },
    });
    const department = await prisma.departments.findFirst({
      where: {
        department: "engineering",
      },
    });
    if (!department) throw "No department found";
    await testCatchAsync(async () => {
      newEmployee = await prisma.employees.create({
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
          jobTitle: "employee",
          description: "new employee",
          departmentId: department?.id,
        },
      });
      if (!newEmployee) throw "No employee found";
    }, true);
  });
  it("should assign role", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: `${newEmployee?.firstName}${newEmployee?.lastName}`,
        password: "user",
        confirmPassword: "user",
        roleId: role?.id,
      },
      id: newEmployee?.id,
    });
  });

  it("should throw duplicate role assignment error", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: `${newEmployee?.firstName}${newEmployee?.lastName}`,
        password: "user",
        confirmPassword: "user",
        roleId: role?.id,
      },
      id: newEmployee?.id,
      expectedStatus: 409,
    });
  });

  it("should throw invalid payload error", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {},
      id: newEmployee?.id,
      expectedStatus: 400,
    });
  });

  it("should fetch all role assignments", async () => {
    await tf.get({
      path: "/roleAssign",
    });
  });

  it("should return assigned role summary", async () => {
    await tf.get({
      path: "/roleAssign/summary",
    });
  });

  it("should fetch self-assigned role", async () => {
    await tf.get({
      path: "/roleAssign/myRole",
    });
  });

  // -----------------------------------------
  // 🚨 EDGE CASE TESTS
  // -----------------------------------------

  it("should reject if confirmPassword doesn't match", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: `${newEmployee?.firstName}${newEmployee?.lastName}`,
        password: "user123",
        confirmPassword: "user456",
        roleId: role?.id,
      },
      id: newEmployee?.id,
      expectedStatus: 400,
    });
  });

  it("should reject assignment if roleId is invalid type", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: `${newEmployee?.firstName}${newEmployee?.lastName}`,
        password: "user",
        confirmPassword: "user",
        roleId: "not-a-number",
      },
      id: newEmployee?.id,
      expectedStatus: 400,
    });
  });

  it("should reject assignment if username is missing", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        password: "user",
        confirmPassword: "user",
        roleId: role?.id,
      },
      id: newEmployee?.id,
      expectedStatus: 400,
    });
  });

  it("should reject assignment with extra/unknown fields", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: `${newEmployee?.firstName}${newEmployee?.lastName}`,
        password: "user",
        confirmPassword: "user",
        roleId: role?.id,
        unauthorizedField: "malicious_data",
      },
      id: newEmployee?.id,
      expectedStatus: 400,
    });
  });

  it("should reject deletion of non-existent role assignment", async () => {
    await tf.delete({
      path: "/roleAssign",
      id: 999999, // assume fake
      expectedStatus: 404,
    });
  });

  it("should reject role assignment to invalid employeeId", async () => {
    await tf.post({
      path: "/roleAssign",
      data: {
        username: "ghostUser",
        password: "ghost",
        confirmPassword: "ghost",
        roleId: role?.id,
      },
      id: 999999,
      expectedStatus: 404,
    });
  });
  it("should delete existing role", async () => {
    await tf.delete({
      path: "/roleAssign",
      id: newEmployee?.id,
    });
  });
  afterAll(async () => {
    await testCatchAsync(async () => {
      const username = `${newEmployee?.firstName}${newEmployee?.lastName}`;
      const email = newEmployee?.email;
      await prisma.authorization.deleteMany({
        where: {
          username,
        },
      });
      await prisma.employees.deleteMany({
        where: {
          email,
        },
      });
    });
  });
});

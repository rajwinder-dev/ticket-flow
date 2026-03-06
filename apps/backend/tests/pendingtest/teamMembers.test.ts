import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe,  it , beforeAll} from "vitest";

const tf = new testFactory();

describe("Team Management API", () => {
  let managerId: number;
  let employeeId: number;
  let adminId: number;

  beforeAll(async () => {
    const lastAssigned = await prisma.teamMembers.findFirst({
      orderBy: { id: "desc" },
    });

    if (!lastAssigned || !lastAssigned.assignedTo || !lastAssigned.employeeId) {
      throw new Error("No valid team member found for testing.");
    }

    managerId = lastAssigned.assignedTo;
    employeeId = lastAssigned.employeeId;
    adminId = lastAssigned.assignedBy;

    const adminAuth = await prisma.authorization.findUnique({
      where: { employeeId: adminId },
    });

    if (!adminAuth?.username) {
      throw new Error("No authorization record found for test employee.");
    }

    await tf.setup(adminAuth.username);
  });

  it("should remove an assigned team member", async () => {
    await tf.delete({
      path: "/team",
      id: employeeId,
    });
  });

  it("should assign a team member to a manager", async () => {
    await tf.post({
      path: "/team",
      id: managerId,
      data: { employeeIds: [employeeId] },
    });
  });

  it("should fail assigning with invalid employee ID type", async () => {
    await tf.post({
      path: "/team",
      id: managerId,
      data: { employeeIds: ["not-a-number"] },
      expectedStatus: 400,
    });
  });

  it("should fail assigning with empty employeeIds array", async () => {
    await tf.post({
      path: "/team",
      id: managerId,
      data: { employeeIds: [] },
      expectedStatus: 400,
    });
  });

  it("should fail assigning with missing body", async () => {
    await tf.post({
      path: `/team/${managerId}`,
      expectedStatus: 400,
    });
  });

  it("should fetch assigned team members for the manager", async () => {
    await tf.get({
      path: "/team",
      id: managerId,
    });
  });

  it("should return 404 for unassigned manager", async () => {
    const unassignedId = 999999;
    await tf.get({
      path: "/team",
      id: unassignedId,
      expectedStatus: 404,
    });
  });

  it("should handle reassignment of the same employee", async () => {
    await tf.post({
      path: "/team",
      id: managerId,
      data: { employeeIds: [employeeId] },
    });
  });

  it("should fail removing an unassigned team member", async () => {
    const unassignedEmployee = 999999;
    await tf.delete({
      path: "/team",
      id: unassignedEmployee,
      expectedStatus: 404,
    });
  });

  it("should get the summary of team members", async () => {
    await tf.get({
      path: "/team/summary",
    });
  });
  it("should fail fetching /team/me for unauthorized user", async () => {
    await tf.get({
      path: "/team/me",
      expectedStatus: 403,
    });
  });
  it("should fetch self-assigned team members", async () => {
    const managerAuth = await prisma.authorization.findUnique({
      where: { employeeId: managerId },
    });

    if (!managerAuth?.username) {
      throw new Error("No authorization record found for manager.");
    }

    await tf.setup(managerAuth.username);

    await tf.get({
      path: "/team/me",
    });
  });
  it("should not allow unauthorized user to assign members", async () => {
    await tf.post({
      path: "/team",
      id: managerId,
      data: { employeeIds: [employeeId] },
      expectedStatus: 403,
    });
  });
});

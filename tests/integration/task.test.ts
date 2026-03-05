import { addDays } from "date-fns";
import { testFactory } from "../helper/testFactory";
import { Authorization, Goal, TeamMembers } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Task Routes", () => {
  let goal: Goal | null;
  let taskId: number;
  let manager: Authorization | null;
  let teamMember: TeamMembers | null;

  beforeAll(async () => {
    teamMember = await prisma.teamMembers.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    if (teamMember?.assignedTo) {
      const auth = await prisma.authorization.findMany({
        where: { employeeId: teamMember.assignedTo },
      });
      manager = auth[Math.floor(auth.length / 2)];
      const goalData = await prisma.goal.findMany({
        orderBy: {
          id: "desc",
        },
        where: { assignedTo: teamMember.assignedTo },
      });
      goal = goalData[Math.floor(goalData.length / 2)];
      if (!goal) throw `No goal found`;
      if (!manager) throw "No Manger found";
    } else {
      throw "No team member found";
    }
    await tf.setup(manager.username);
  });

  it("should create a new task", async () => {
    const response = await tf.post({
      path: "/task",
      id: goal?.id,
      data: {
        task: "Test task creation",
        deadline: addDays(new Date(), 2),
        assignedTo: teamMember?.employeeId,
      },
    });
    taskId = response.data.id;
  });

  it("should update the task", async () => {
    await tf.patch({
      path: "/task",
      id: taskId,
      data: {
        task: "Updated task name",
        deadline: addDays(new Date(), 3),
      },
    });
  });

  it("should get all tasks for the goal", async () => {
    await tf.get({
      path: "/task",
      id: goal?.id,
    });
  });

  it("should soft delete the task", async () => {
    await tf.delete({
      path: "/task",
      id: taskId,
    });
  });

  it("should return 400 for missing fields", async () => {
    await tf.post({
      path: "/task",
      id: goal?.id,
      data: {},
      expectedStatus: 400,
    });
  });

  it("should return 400 for past deadline", async () => {
    await tf.post({
      path: "/task",
      id: goal?.id,
      data: {
        task: "Past deadline",
        deadline: addDays(new Date(), -2),
        assignedTo: teamMember?.employeeId,
      },
      expectedStatus: 400,
    });
  });

  // ❌ Invalid goal ID
  it("should return 404 for non-existent goal", async () => {
    await tf.post({
      path: "/task",
      id: 9999999,
      data: {
        task: "Invalid goal",
        deadline: addDays(new Date(), 2),
        assignedTo: teamMember?.employeeId,
      },
      expectedStatus: 404,
    });
  });

  // ❌ Invalid assignedTo format
  it("should return 400 for invalid assignedTo ID", async () => {
    await tf.post({
      path: "/task",
      id: goal?.id,
      data: {
        task: "Invalid assignedTo",
        deadline: addDays(new Date(), 2),
        assignedTo: "invalid-id",
      },
      expectedStatus: 400,
    });
  });

  it("should return 400 for invalid task description", async () => {
    await tf.post({
      path: "/task",
      id: goal?.id,
      data: {
        task: "",
        deadline: addDays(new Date(), 2),
        assignedTo: teamMember?.employeeId,
      },
      expectedStatus: 400,
    });

    await tf.post({
      path: "/task",
      id: goal?.id,
      data: {
        task: "a".repeat(256),
        deadline: addDays(new Date(), 2),
        assignedTo: teamMember?.employeeId,
      },
      expectedStatus: 400,
    });
  });

  // it("should return 403 for unauthorized user", async () => {
  //   const authData = await prisma.authorization.findMany({
  //     where: {
  //       Roles: {
  //         name: "employee",
  //       },
  //     },
  //   });
  //   await tf.setup(authData[Math.floor(authData.length / 2)].username);
  //   await tf.post({
  //     path: "/task",
  //     id: goal?.id,
  //     data: {
  //       task: "Unauthorized access attempt",
  //       deadline: addDays(new Date(), 2),
  //       assignedTo: teamMember?.employeeId,
  //     },
  //     expectedStatus: 403,
  //   });
  //   await tf.setup(manager?.username);
  // });

  afterAll(async () => {
    try {
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
    } catch {
      console.log("Cleanup: task already deleted or not found");
    }
  });
});

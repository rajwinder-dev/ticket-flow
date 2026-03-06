import { Goal, Task } from "../../generated/prisma";
import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe,  it , beforeAll, afterAll} from "vitest";

const tf = new testFactory();

describe("Review Routes - Core & Edge Case Tests", () => {
  let goal: Goal | null;
  let task: Task | null;
  let goalReviewId: number;
  let taskReviewId: number;

  beforeAll(async () => {
    await tf.setup();
    const goalData = await prisma.goal.findMany();
    goal = goalData[Math.floor(goalData.length / 2)];

    const taskData = await prisma.task.findMany();
    task = taskData[Math.floor(taskData.length / 2)];
    if (!goal) throw "No goal found";
    if (!task) throw "No task found";
  });

  // ✅ Goal Review
  it("should create goal review", async () => {
    const data = await tf.post({
      path: "/review/goal",
      id: goal?.id,
      data: {
        review: "this is test review",
        rating: 3,
      },
    });
    goalReviewId = data.data.id;
  });

  it("should update goal review", async () => {
    await tf.patch({
      path: "/review/goal",
      id: goalReviewId,
      data: {
        review: "this is test review updated",
        rating: 4,
      },
    });
  });

  it("should soft delete goal review", async () => {
    await tf.delete({
      path: "/review/goal",
      id: goalReviewId,
    });
  });

  // ✅ Task Review
  it("should create task review", async () => {
    const data = await tf.post({
      path: "/review/task",
      id: task?.id,
      data: {
        review: "this is test review",
        rating: 3,
      },
    });
    taskReviewId = data.data.id;
  });

  it("should update task review", async () => {
    await tf.patch({
      path: "/review/task",
      id: taskReviewId,
      data: {
        review: "this is test review updated",
        rating: 5,
      },
    });
  });

  it("should soft delete task review", async () => {
    await tf.delete({
      path: "/review/task",
      id: taskReviewId,
    });
  });

  it("should return review summary", async () => {
    await tf.get({
      path: "/review/summary",
    });
  });

  // ----------------------------------------
  // 🚨 Edge Case Tests Below
  // ----------------------------------------

  it("should not create goal review with invalid rating", async () => {
    await tf.post({
      path: "/review/goal",
      id: goal?.id,
      data: {
        review: "invalid rating",
        rating: 6, // assuming 1–5 is valid
      },
      expectedStatus: 400,
    });
  });

  it("should not create review with empty review text", async () => {
    await tf.post({
      path: "/review/task",
      id: task?.id,
      data: {
        review: "",
        rating: 3,
      },
      expectedStatus: 400,
    });
  });

  it("should not create review with missing fields", async () => {
    await tf.post({
      path: "/review/goal",
      id: goal?.id,
      data: {},
      expectedStatus: 400,
    });
  });

  it("should not update review with invalid ID", async () => {
    await tf.patch({
      path: "/review/goal",
      id: "bad-id" as unknown as number,
      data: {
        review: "invalid update",
        rating: 2,
      },
      expectedStatus: 400,
    });
  });

  it("should not update deleted goal review", async () => {
    await tf.patch({
      path: "/review/goal",
      id: goalReviewId,
      data: {
        review: "try updating deleted review",
        rating: 3,
      },
      expectedStatus: 404,
    });
  });

  it("should return 404 on deleting already deleted task review", async () => {
    await tf.delete({
      path: "/review/task",
      id: taskReviewId,
      expectedStatus: 404,
    });
  });

  it("should reject review with overly long text", async () => {
    await tf.post({
      path: "/review/task",
      id: task?.id,
      data: {
        review: "a".repeat(1000),
        rating: 3,
      },
      expectedStatus: 400,
    });
  });

  afterAll(async () => {
    try {
      await prisma.goalReview.delete({
        where: { id: goalReviewId },
      });
    } catch {
      console.log("clear goal error");
    }

    try {
      await prisma.taskReview.delete({
        where: { id: taskReviewId },
      });
    } catch {
      console.log("clear task error");
    }
  });
});

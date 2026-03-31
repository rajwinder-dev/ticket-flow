import {
  type GoalReview,
  type CreateReview,
  type TaskReview,
  type ReviewSummary,
} from "../types/reviewTypes";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../utils/axis";

export async function createGoalReview(input: CreateReview) {
  const data = await postRequest<GoalReview>({
    path: "/review/goal",
    data: input,
  });
  return data;
}

export async function updateGoalReview(input: CreateReview, goalId: number) {
  const data = await patchRequest<GoalReview>({
    path: `/review/goal/${goalId}`,
    data: input,
  });
  return data;
}

export async function deleteGoalReview(goalId: number) {
  const data = await deleteRequest({
    path: `/review/goal/${goalId}`,
  });
  return data;
}

export async function createTaskReview(input: CreateReview) {
  const data = await postRequest<TaskReview>({
    path: "/review/task",
    data: input,
  });
  return data;
}

export async function updateTaskReview(input: CreateReview, taskId: number) {
  const data = await patchRequest<TaskReview>({
    path: `/review/task/${taskId}`,
    data: input,
  });
  return data;
}

export async function deleteTaskReview(taskId: number) {
  const data = await deleteRequest({
    path: `/review/task/${taskId}`,
  });
  return data;
}

export async function getReviewSummary() {
  const data = await getRequest<ReviewSummary>({
    path: "/review/summary",
  });
  return data;
}

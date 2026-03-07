import type { FilterOptions } from "../types/genetic";
import {
  type CreateGoal,
  type GoalDetails,
  type GoalSummary,
} from "../types/goalTypes";
import {
  deleteRequest,
  getRequest,
  getRequestMany,
  postRequest,
} from "../utils/axis";

export async function createGoal(input: CreateGoal, managerId: number) {
  const data = await postRequest<GoalDetails>({
    path: `/goal/${managerId}`,
    data: input,
  });
  return data;
}
export async function updateGoal(input: CreateGoal, goalId: number) {
  const data = await postRequest<GoalDetails>({
    path: `/goal/${goalId}`,
    data: input,
  });
  return data;
}
export async function getAllGoals({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<GoalDetails>({
    path: "/goal",
    filterOptions,
  });
  return data;
}
export async function getGoalDetails(goalId: number) {
  const data = await getRequest<GoalDetails>({
    path: `/goal/${goalId}`,
  });
  return data;
}
export async function getGoalSummary() {
  const data = await getRequest<GoalSummary>({
    path: "/goal/summary",
  });
  return data;
}

export async function deleteGoal(goalId: number) {
  await deleteRequest({
    path: `/goal/${goalId}`,
  });
  return true;
}

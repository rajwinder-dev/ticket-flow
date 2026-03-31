import type { FilterOptions } from "../types/genetic";
import type { CreateTask, TaskDetails, UpdateTask } from "../types/taskTypes";
import { deleteRequest, getRequestMany, patchRequest, postRequest } from "../utils/axis";

export async function createTask(input: CreateTask, managerId: number) {
  const data = await postRequest<TaskDetails>({
    path: `/task/${managerId}`,
    data: input,
  });
  return data;
}

export async function updateTask(input: UpdateTask, taskId: number) {
  const data = await patchRequest<TaskDetails>({
    path: `/task/${taskId}`,
    data: input,
  });
  return data;
}

export async function getGoalTasks({
  goalId,
  filterOptions,
}: {
  goalId: number;
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<TaskDetails>({
    path: `/task/${goalId}`,
    filterOptions,
  });
  return data;
}

export async function deleteTask(taskId: number) {
  const data = await deleteRequest({
    path: `/task/${taskId}`,
  })
  return data
}

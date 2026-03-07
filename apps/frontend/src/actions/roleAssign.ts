import type {
  AssignRole,
  AssignRoleDetails,
  myAssignRole,
} from "../types/roleAssignTypes";
import { deleteRequest, getRequest, postRequest } from "../utils/axis";

export async function assignRole(input: AssignRole, employeeId: number) {
  const data = await postRequest<AssignRoleDetails>({
    path: `/roleAssign/${employeeId}`,
    data: input,
  });
  return data;
}

export async function getMyRole() {
  const data = await getRequest<myAssignRole>({
    path: "/roleAssign/myRole",
  });
  return data;
}
export async function roleAssignSummary() {
  const data = await getRequest<myAssignRole>({
    path: "/roleAssign/summary",
  });
  return data;
}
export async function deleteAssignedRole(employeeId: number) {
    const data = await deleteRequest({
    path: `/roleAssign/${employeeId}`,
  });
  return data;
}

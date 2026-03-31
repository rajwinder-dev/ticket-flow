import type {
  AdminDashboard,
  EmployeeDashboard,
  ManagerDashboard,
} from "../types/dashboardTypes";
import { getRequest } from "../utils/axis";

export async function adminDashboard(): Promise<AdminDashboard> {
  const data = await getRequest<AdminDashboard>({
    path: `/dashboard/admin`,
  });
  return data;
}
export async function managerDashboard(): Promise<ManagerDashboard> {
  const data = await getRequest<ManagerDashboard>({
    path: `/dashboard/manager`,
  });
  return data;
}
export async function employeeDashboard(): Promise<EmployeeDashboard> {
  const data = await getRequest<EmployeeDashboard>({
    path: `/dashboard/employee`,
  });
  return data;
}

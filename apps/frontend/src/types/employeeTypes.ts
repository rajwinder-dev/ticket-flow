export type Options = {
  limit: number;
  offset: number;
  sorting?: { sortby: string; sortOrder?: "asc" | "desc" };
  filter?: Record<string, string | number>;
  fields?: string[];
};
export interface CreateEmployee {
  uuid: string;
  gender: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  idType: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  hireDate: string;
  jobTitle: string;
  description: string;
  departmentId: number;
  image?: string | null;
}
export interface EmployeesDetails extends CreateEmployee {
  id: number;
  srNo?: number;
  createdAt: string;
  updatedAt: string;
  nationalId: string;
  idType: string;
  description: string;
}
export interface EmployeeRecords {
  srNo: number;
  id: number;
  firstName: string;
  email: string;
  jobTitle: string;
  image?: string;
}
export interface updateDetails {
  email: string;
  phoneNumber: string;
  address: string;
  image?: string;
};

export interface EmployeeSummary {
  employeeCount: number;
  employeeJoinThisMonth: number;
  employeeOnLeave: number;
  unAssignedEmployees: number;
}

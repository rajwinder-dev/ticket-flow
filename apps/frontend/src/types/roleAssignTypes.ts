export interface AssignRole {
  username: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

export interface AssignRoleDetails {
  srNo?: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  employeeId: number;
  username: string;
  roleId: number;
}

export interface AssignRoleSummary {
  roleCount: number;
  totalEmployees: number;
  totalManager: number;
  totalAdmins: number;
}
export interface myAssignRole {
  employeeId: number;
  username: string;
  roleId: number;
  email: string;
  image: null;
  name: string;
}

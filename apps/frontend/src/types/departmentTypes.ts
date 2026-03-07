export interface CreateDepartment {
  department: string;
  head: string;
  description: string;
}
export interface DepartmentDetails extends CreateDepartment {
  srNo?: number
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRole {
  name: string;
  description: string;
}
export interface RoleDetails extends CreateRole {
  srNo?: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

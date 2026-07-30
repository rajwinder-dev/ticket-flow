export interface GetMyOrganizationsRow {
  id: string; // UUID
  name: string;
  logo: string | null;
  createdBy: string; // UUID
  roleName: string;
  isOwner: boolean;
  total_count: bigint; // COUNT(*) OVER() returns bigint in Postgres
}

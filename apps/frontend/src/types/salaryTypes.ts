export interface CreateSalary {
  base: number;
  allowance: number;
  bonus: number;
  deductions: number;
  salaryType: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  note: string;
}
export interface SalaryDetails extends CreateSalary {
  srNo?: number;
  id: number;
  createdAt: string;
  employeeId: number;
  netPay: number;
}
export interface SalarySummary {
  totalPayRole: number;
  pendingEmployees: number;
  deduction: number;
  bonuses: number;
}

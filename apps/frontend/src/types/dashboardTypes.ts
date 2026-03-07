// * Admin dashboard
interface EmployeeDepartmentStats {
  _count: number;
  departmentId: number;
}

interface RoleStats {
  _count: number;
  roleId: number;
}

interface NetPaySum {
  _sum: {
    netPay: number;
  };
}

interface GoalAssignedTo {
  id: number;
  name: string;
}

interface GoalSummaryItem {
  id: number;
  goal: string;
  deadline: string; // ISO 8601 date string
  assignedTo: GoalAssignedTo;
  completed: number;
  pending: number;
  totalTasks: number;
  completePercent: number;
}

interface TaskTimeSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface ReviewUpdatesSummary {
  thisMonth: number;
}

export interface AdminDashboard {
  employeeStats: {
    activeEmployees: number;
    totalEmployees: number;
    employeeDepartment: EmployeeDepartmentStats[];
  };
  authStats: {
    roles: RoleStats[];
    totalAssignedRoles: number;
    assignedRolePreviousMonth: number;
  };
  attendanceStats: {
    employeePresentToday: number;
    employeePresentThisMonth: number;
    thisMonthPresentPercent: number;
    todayAttendancePercent: number;
  };
  salaryState: {
    lastMonthPayRole: NetPaySum;
    totalPayRole: NetPaySum;
    baseSalaryCount: number;
    pendingSalaries: number;
  };
  leaveStats: {
    totalPendingLeaves: number;
    totalApprovedThisMonth: number;
    totalRejectThisMonth: number;
  };
  goalSummary: GoalSummaryItem[];
  taskSummary: {
    assigned: TaskTimeSummary;
    completed: TaskTimeSummary;
  };
  taskReviewSummary: {
    reviews: TaskTimeSummary;
    reviewUpdates: ReviewUpdatesSummary;
  };
}
// * Manger dashboard
interface ManagerAttendance {
  employeePresentToday: number;
  employeePresentThisMonth: number;
}

interface ManagerLeavesStatus {
  totalPendingLeaves: number;
  totalApprovedThisMonth: number;
  totalRejectThisMonth: number;
}

interface ManagerTaskTimeSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface ManagerTaskStatus {
  assigned: ManagerTaskTimeSummary;
  completed: ManagerTaskTimeSummary;
}

interface ManagerGoalAssignedTo {
  id: number;
  name: string;
}

interface ManagerGoalStatusItem {
  id: number;
  goal: string;
  deadline: string; // ISO 8601 date string
  assignedTo: ManagerGoalAssignedTo;
  completed: number;
  pending: number;
  totalTasks: number;
  completePercent: number;
}

interface ManagerReviewUpdates {
  thisMonth: number;
}

interface ManagerReviewStatus {
  reviews: ManagerTaskTimeSummary;
  reviewUpdates: ManagerReviewUpdates;
}

// Main interface for the ManagerDashboard
export interface ManagerDashboard {
  employeePresent: ManagerAttendance;
  leavesStatus: ManagerLeavesStatus;
  taskStatus: ManagerTaskStatus;
  goalStatus: ManagerGoalStatusItem[];
  reviewStatus: ManagerReviewStatus;
}
// * employee dashboard
// Nested interfaces for clarity

interface EmployeeSalaryStatusSum {
  _sum: {
    netPay: number;
  };
}

interface EmployeeSalaryStatus {
  lastMonthPayRole: EmployeeSalaryStatusSum;
  totalPayRole: EmployeeSalaryStatusSum;
  baseSalaryCount: number;
}

interface EmployeeLeavesStatus {
  totalPendingLeaves: number;
  totalApprovedThisMonth: number;
  totalRejectThisMonth: number;
}

interface EmployeeTaskTimeSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface EmployeeTaskStatus {
  assigned: EmployeeTaskTimeSummary;
  completed: EmployeeTaskTimeSummary;
}

interface EmployeeGoal {
  goal: string;
  deadline: string; // ISO 8601 date string
  completed: number;
  pending: number;
  totalTasks: number;
  completePercent: number;
}

// Main interface for the EmployeeDashboard
export interface EmployeeDashboard {
  todayAttendanceMarked: boolean;
  presentDaysThisMonth: number;
  totalDaysThisMonth: number;
  salaryStatus: EmployeeSalaryStatus;
  leavesStatus: EmployeeLeavesStatus;
  taskStatus: EmployeeTaskStatus;
  employeeGoals: EmployeeGoal[];
}

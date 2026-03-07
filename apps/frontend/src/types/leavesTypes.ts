export interface CreateLeave {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface LeaveDetails extends CreateLeave {
  srNo?: number;
  id: number;
  employeeId: number;
  status: string;
  appliedAt: Date;
  updatedAt: Date;
}
export interface LeaveSummary {
  totalLeaveRequest30Days: number;
  totalApproved30Days:number
  totalPending30Days:number
  totalRejected30Days: number
}

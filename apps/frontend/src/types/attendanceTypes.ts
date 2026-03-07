export interface AttendanceDetails {
  srNo: number;
  id: number;
  checkIn: Date;
  checkOut: Date;
  status: string;
}
export interface AttendanceSummary {
  totalPresent: number;
  lateArivel: number;
  avgAttendanceTime: string;
  attendanceTrend: string;
}

import { differenceInBusinessDays, endOfToday, startOfMonth } from "date-fns";
import { catchAsync } from "../../core/utils/catchAsync";
import { dashboardService } from "./dashboard.service";
import response from "../../core/utils/response";
import { prisma } from "../../core/utils/prismaClient";

export class dashboardController {
  static getAdminSummary = catchAsync(async (req, res, _next) => {
    const [
      employeeStats,
      authStats,
      attendanceStats,
      salaryState,
      leaveStats,
      goalSummary,
      taskSummary,
      taskReviewSummary,
    ] = await Promise.all([
      dashboardService.getEmployeeStats(),
      dashboardService.getAuthorizationStats(),
      dashboardService.getAttendanceStats(),
      dashboardService.getSalaryState(),
      dashboardService.getLeaveStats(),
      dashboardService.getGoalSummary(
        req.query.limit as string,
        req.query.offset as string
      ),
      dashboardService.getTaskSummary(),
      dashboardService.getReviewSummary(),
    ]);
    const { thisMonthPresentPercent, todayAttendancePercent, pendingSalaries } =
      dashboardService.calculateDashboardMatrices(
        authStats.totalAssignedRoles,
        attendanceStats.employeePresentThisMonth,
        attendanceStats.employeePresentToday,
        authStats.assignedRolePreviousMonth,
        salaryState.baseSalaryCount
      );
    const data = {
      employeeStats,
      authStats,
      attendanceStats: {
        ...attendanceStats,
        thisMonthPresentPercent,
        todayAttendancePercent,
      },
      salaryState: { ...salaryState, pendingSalaries },
      leaveStats,
      goalSummary,
      taskSummary,
      taskReviewSummary,
    };
    response(res, data, 200, {
      otherFields: {
        limit: Number(req.query.limit ?? 0),
        offset: Number(req.query.offset ?? 10),
      },
    });
  });
  static getManagerSummary = catchAsync(async (req, res, _next) => {
    const teamMembers = await prisma.teamMembers.findMany({
      where: {
        assignedTo: req.user.employeeId,
      },
    });
    const employeeIds = teamMembers.map((item) => item.employeeId);
    const employeePresent =
      await dashboardService.getAttendanceStats(employeeIds);
    const leavesStatus = await dashboardService.getLeaveStats(employeeIds);
    const taskStatus = await dashboardService.getTaskSummary(
      req.user.employeeId
    );
    const goalStatus = await dashboardService.getGoalSummary(
      req.query.limit as string,
      req.query.offset as string,
      req.user.employeeId
    );
    const taskData = await prisma.task.findMany({
      where: {
        assignedBy: req.user.employeeId,
      },
    });
    const taskIds = taskData.map((item) => item.id);
    const reviewStatus = await dashboardService.getReviewSummary(taskIds);
    const data = {
      employeePresent,
      leavesStatus,
      taskStatus,
      goalStatus,
      reviewStatus,
    };
    response(res, data, 200, {
      otherFields: {
        limit: Number(req.query.limit ?? 0),
        offset: Number(req.query.offset ?? 10),
      },
    });
  });
  static getEmployeeSummary = catchAsync(async (req, res, _next) => {
    const employeeId = Number(req.user.employeeId);
    const { employeePresentThisMonth, employeePresentToday } =
      await dashboardService.getAttendanceStats([employeeId]);

    const salaryStatus = await dashboardService.getSalaryState([employeeId]);
    const leavesStatus = await dashboardService.getLeaveStats([employeeId]);
    const taskStatus = await dashboardService.getTaskSummary(
      employeeId,
      "assignedTo"
    );
    const mangerData = await prisma.teamMembers.findUnique({
      where: {
        employeeId: req.user.employeeId,
      },
    });
    const goalStatus = await dashboardService.getGoalSummary(
      req.query.limit as string,
      req.query.offset as string,
      mangerData?.assignedTo
    );
    const employeeGoals = goalStatus.map((goal) => ({
      goal: goal.goal,
      deadline: goal.deadline,
      completed: goal.completed,
      pending: goal.pending,
      totalTasks: goal.totalTasks,
      completePercent: goal.completePercent,
    }));
    const data = {
      todayAttendanceMarked: Boolean(employeePresentToday),
      presentDaysThisMonth: employeePresentThisMonth,
      totalDaysThisMonth: differenceInBusinessDays(
        endOfToday(),
        startOfMonth(new Date())
      ),
      salaryStatus,
      leavesStatus,
      taskStatus,
      employeeGoals,
    };
    response(res, data, 200, {
      otherFields: {
        limit: Number(req.query.limit ?? 0),
        offset: Number(req.query.offset ?? 10),
      },
    });
  });
}

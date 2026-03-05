import {
  differenceInBusinessDays,
  endOfMonth,
  endOfToday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
} from "date-fns";
import { prisma } from "../../core/utils/prismaClient";

export class dashboardService {
  static async getEmployeeStats() {
    const [activeEmployees, totalEmployees, employeeDepartment] =
      await Promise.all([
        prisma.employees.count({ where: { active: true } }),
        prisma.employees.count(),
        prisma.employees.groupBy({
          by: ["departmentId"],
          _count: true,
          where: { active: true },
        }),
      ]);
    return { activeEmployees, totalEmployees, employeeDepartment };
  }
  static async getAuthorizationStats() {
    const [roles, totalAssignedRoles, assignedRolePreviousMonth] =
      await Promise.all([
        prisma.authorization.groupBy({
          by: ["roleId"],
          _count: true,
        }),
        prisma.authorization.count(),
        prisma.authorization.count({
          where: {
            createdAt: {
              lte: startOfMonth(subMonths(new Date(), 1)),
            },
          },
        }),
      ]);
    return { roles, totalAssignedRoles, assignedRolePreviousMonth };
  }
  static async getAttendanceStats(employeeIds?: number[]) {
    const [employeePresentToday, employeePresentThisMonth] = await Promise.all([
      prisma.attendance.count({
        where: {
          createdAt: {
            gte: startOfToday(),
            lte: endOfToday(),
          },
          ...(employeeIds && employeeIds.length > 0
            ? { employeeId: { in: employeeIds } }
            : {}),
          OR: [{ status: "Present" }, { status: "Half-day" }],
        },
      }),
      prisma.attendance.count({
        where: {
          createdAt: {
            gte: startOfMonth(new Date()),
            lte: endOfToday(),
          },
          ...(employeeIds && employeeIds.length > 0
            ? { employeeId: { in: employeeIds } }
            : {}),
          OR: [{ status: "Present" }, { status: "Half-day" }],
        },
      }),
    ]);
    return { employeePresentToday, employeePresentThisMonth };
  }
  static async getSalaryState(employeeIds?: number[]) {
    const [lastMonthPayRole, totalPayRole, baseSalaryCount] = await Promise.all(
      [
        prisma.salaries.aggregate({
          _sum: {
            netPay: true,
          },
          where: {
            createdAt: {
              gte: startOfMonth(subMonths(new Date(), 1)),
              lte: endOfMonth(subMonths(new Date(), 1)),
            },
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
          },
        }),
        prisma.salaries.aggregate({
          _sum: {
            netPay: true,
          },
          where: {
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
          },
        }),
        prisma.salaries.count({
          where: {
            createdAt: {
              gte: startOfMonth(subMonths(new Date(), 1)),
              lte: endOfMonth(subMonths(new Date(), 1)),
            },
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
            salaryType: "Base",
          },
        }),
      ]
    );
    return { lastMonthPayRole, totalPayRole, baseSalaryCount };
  }
  static async getLeaveStats(employeeIds?: number[]) {
    const [totalPendingLeaves, totalApprovedThisMonth, totalRejectThisMonth] =
      await Promise.all([
        prisma.leave.count({
          where: {
            status: "Pending",
            appliedAt: {
              gte: subMonths(new Date(), 2),
              lte: endOfToday(),
            },
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
          },
        }),
        prisma.leave.count({
          where: {
            status: "Approved",
            updatedAt: {
              gte: startOfMonth(new Date()),
              lte: endOfToday(),
            },
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
          },
        }),
        prisma.leave.count({
          where: {
            status: "Rejected",
            updatedAt: {
              gte: startOfMonth(new Date()),
              lte: endOfToday(),
            },
            ...(employeeIds && employeeIds.length > 0
              ? { employeeId: { in: employeeIds } }
              : {}),
          },
        }),
      ]);
    return { totalPendingLeaves, totalApprovedThisMonth, totalRejectThisMonth };
  }
  static async getTaskSummary(assignedBy?: number, useField?: string) {
    const [today, week, month] = [
      startOfToday(),
      startOfWeek(new Date()),
      startOfMonth(new Date()),
    ];
    const [
      todayAssigned,
      weekAssigned,
      monthAssigned,
      todayCompleted,
      weekCompleted,
      monthCompleted,
    ] = await Promise.all([
      this.countTasks({ from: today, assignedBy, useField }),
      this.countTasks({ from: week, assignedBy, useField }),
      this.countTasks({ from: month, assignedBy, useField }),
      this.countTasks({ from: today, done: true, assignedBy, useField }),
      this.countTasks({ from: week, done: true, assignedBy, useField }),
      this.countTasks({ from: month, done: true, assignedBy }),
    ]);

    return {
      assigned: {
        today: todayAssigned,
        thisWeek: weekAssigned,
        thisMonth: monthAssigned,
      },
      completed: {
        today: todayCompleted,
        thisWeek: weekCompleted,
        thisMonth: monthCompleted,
      },
    };
  }
  static async getReviewSummary(taskId?: number[]) {
    const [today, week, month] = [
      startOfToday(),
      startOfWeek(new Date()),
      startOfMonth(new Date()),
    ];
    const [todayReview, weekReview, monthReview, updatedReviews] =
      await Promise.all([
        this.countTasksReviews({ from: today, taskId }),
        this.countTasksReviews({ from: week, taskId }),
        this.countTasksReviews({ from: month, taskId }),
        this.countTasksReviews({ from: today, done: true, taskId }),
      ]);

    return {
      reviews: {
        today: todayReview,
        thisWeek: weekReview,
        thisMonth: monthReview,
      },
      reviewUpdates: {
        thisMonth: updatedReviews,
      },
    };
  }
  static async getGoalSummary(
    limit?: string,
    offset?: string,
    assignedTo?: number | null
  ) {
    const skip = isNaN(Number(offset)) ? 0 : Number(offset);
    const take = isNaN(Number(limit)) ? 10 : Number(limit);
    const goals = await prisma.goal.findMany({
      skip,
      take,
      ...(assignedTo ? { where: { assignedTo } } : {}),
      include: {
        AssignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Task: {
          select: {
            done: true,
          },
        },
      },
    });

    const goalSummary = goals.map((goal) => {
      const totalTasks = goal.Task.length;
      const completed = goal.Task.filter((task) => task.done).length;
      const pending = totalTasks - completed;
      const completePercent =
        totalTasks === 0 ? 0 : Math.floor((completed / totalTasks) * 100);

      return {
        id: goal.id,
        goal: goal.goal,
        deadline: goal.deadline,
        assignedTo: {
          id: goal.assignedTo,
          name: `${goal.AssignedTo.firstName} ${goal.AssignedTo.lastName}`,
        },
        completed,
        pending,
        totalTasks,
        completePercent,
      };
    });
    return goalSummary;
  }
  static calculateDashboardMatrices(
    totalAssignedRoles: number,
    employeePresentThisMonth: number,
    employeePresentToday: number,
    assignedRoleBeforeThisMonth: number,
    baseSalaryCount: number
  ) {
    const totalBusinessDays = differenceInBusinessDays(
      endOfToday(),
      startOfMonth(new Date())
    );
    const totalDaysUntilNow = totalBusinessDays * totalAssignedRoles;

    const thisMonthPresentPercent = Math.floor(
      (employeePresentThisMonth / totalDaysUntilNow) * 100
    );

    //  * today attendance logic
    const todayAttendancePercent = Math.round(
      (employeePresentToday / totalAssignedRoles) * 100
    );
    const pendingSalaries = Math.abs(
      assignedRoleBeforeThisMonth - baseSalaryCount
    );
    return { thisMonthPresentPercent, todayAttendancePercent, pendingSalaries };
  }
  private static countTasks({
    from,
    done,
    assignedBy,
    useField,
  }: {
    from: Date;
    done?: boolean;
    assignedBy?: number;
    useField?: string;
  }) {
    let assignedByFilter = {};
    if (useField) {
      assignedByFilter = { [useField]: assignedBy };
    } else {
      assignedByFilter = { assignedBy };
    }
    return prisma.task.count({
      where: {
        ...(done ? { updatedAt: { gte: from } } : { createdAt: { gte: from } }),
        ...assignedByFilter,
        active: true,
      },
    });
  }
  private static countTasksReviews({
    from,
    done,
    taskId,
  }: {
    from: Date;
    done?: boolean;
    taskId?: number[];
  }) {
    return prisma.taskReview.count({
      where: {
        ...(done ? { updatedAt: { gte: from } } : { createdAt: { gte: from } }),
        ...(taskId && taskId.length > 0 ? { taskId: { in: taskId } } : {}),
        active: true,
      },
    });
  }
}

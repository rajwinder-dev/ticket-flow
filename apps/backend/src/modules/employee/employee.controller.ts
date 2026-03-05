import { startOfDay } from "date-fns";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { Employees } from "../../../generated/prisma";

export default class EmployeeController {
  private static handler = new HandleFactory<Employees>(prisma.employees, {
    enableDelete: true,
  });

  static getAllEmployees = this.handler.getMany({
    select: ["id", "firstName", "email", "jobTitle", "image", "jobTitle"],
  });
  static createEmployee = this.handler.createOne({
    notify: "new employee is added",
    broadCast: ["admin"],
  });
  static updateEmployee = this.handler.updateOne();
  static deleteEmployee = this.handler.deleteOne({
    notify: "employee is removed",
    broadCast: ["admin"],
  });
  static getEmployeeDetails = this.handler.getOne();

  static getMyDetails = this.handler.getOne({
    protect: true,
  });
  static updateMyDetails = this.handler.updateOne({
    protect: true,
  });
  static employeeSummary = catchAsync(async (req, res, _next) => {
    const past30Days = new Date();
    past30Days.setDate(past30Days.getDate() - 30);
    const [employeeCount, employeeJoinThisMonth, employeeOnLeave] =
      await Promise.all([
        prisma.employees.count({
          where: { active: true },
        }),
        prisma.employees.count({
          where: { createdAt: { gte: past30Days } },
        }),
        prisma.attendance.count({
          where: {
            status: {
              in: ["onLeave", "pending"],
            },
            createdAt: { gte: startOfDay(new Date()) },
          },
        }),
      ]);
    const totalAssignedRoles = await prisma.authorization.count();
    const unAssignedEmployees = Math.abs(totalAssignedRoles - employeeCount);
    const data = {
      employeeCount,
      employeeJoinThisMonth,
      employeeOnLeave,
      unAssignedEmployees,
    };
    response(res, data);
  });
}

import { Authorization } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import response from "../../core/utils/response";
import { prisma } from "../../core/utils/prismaClient";

export class roleAssignController {
  private static handler = new HandleFactory<Authorization>(
    prisma.authorization
  );
  static assignRole = this.handler.createOne({ params: "employeeId" });
  static removeRole = this.handler.removeOne({ params: "employeeId" });
  static updateRole = this.handler.updateOne({
    exclude: ["password", "employeeId"],
    params: "employeeId",
  });
  static getRoles = this.handler.getMany({
    includeRelation: "Employees",
    includeFields: ["email", "jobTitle"],
    exclude: ["password", "id", "updatedAt"],
  });
  static getMyRole = catchAsync(async (req, res, _next) => {
    const employeeId = req.user.employeeId;
    const data = await prisma.authorization.findUnique({
      where: {
        employeeId,
      },
      include: {
        Employees: {
          select: {
            email: true,
            image: true,
          },
        },
        Roles: {
          select: {
            name: true,
          },
        },
      },
    });

    const flatData = { ...data, ...data?.Employees, ...data?.Roles };
    delete flatData.Employees;
    delete flatData.Roles;
    response(res, flatData, 200, { hideFields: ["createdAt", "updatedAt", "id"] });
  });
  static roleSummary = catchAsync(async (req, res, _next) => {
    const [totalRoles, totalEmployees, totalManager, totalAdmins] =
      await Promise.all([
        prisma.authorization.groupBy({
          by: ["roleId"],
          _count: true,
        }),
        prisma.authorization.count({
          where: {
            Roles: {
              name: "employee",
            },
          },
        }),
        prisma.authorization.count({ where: { Roles: { name: "manager" } } }),
        prisma.authorization.count({ where: { Roles: { name: "admin" } } }),
      ]);
    const roleCount = totalRoles.length;
    const data = { roleCount, totalEmployees, totalManager, totalAdmins };
    response(res, data);
  });
}

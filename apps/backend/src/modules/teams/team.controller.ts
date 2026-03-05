import { prisma } from "../../core/utils/prismaClient";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import HandleFactory from "../../core/utils/handlerFactory";
import { TeamMembers } from "../../../generated/prisma";

export class teamController {
  private static handler = new HandleFactory<TeamMembers>(prisma.teamMembers);
  static assignTeam = catchAsync(async (req, res, _next) => {
    const employeeIds: number[] = req.body.employeeIds;
    const data: {
      employeeId: number;
      assignedBy: number;
      assignedTo: number;
    }[] = employeeIds.map((id) => {
      return {
        employeeId: id,
        assignedBy: Number(req.user.employeeId),
        assignedTo: Number(req.params.id),
      };
    });
    await prisma.teamMembers.createMany({
      data,
      skipDuplicates: true,
    });
    // notificationServer.createNotification(
    //   Number(req.user.employeeId),
    //   Number(req.params.id),
    //   "New Team members Assigned"
    // );
    response(res, data, 201);
  });
  static deleteMember = this.handler.removeOne({
    params: "employeeId",
  });
  static getTeamMembers = this.handler.getMany({
    params: "assignedTo",
    includeRelation: "AssignedTo",
    useField: "employeeId",
    exclude: ["id", "assignedTo"],
  });
  static getMyTeamMembers = catchAsync(async (req, res, _next) => {
    const data = await prisma.teamMembers.findMany({
      where: {
        assignedTo: req.user.employeeId,
      },
      include: {
        Employee: {
          select: {
            username: true,
            Employees: {
              select: {
                firstName: true,
                lastName: true,
                jobTitle: true,
                email: true,
              },
            },
          },
        },
      },
    });

    response(res, data, 200, {
      hideFields: ["id", "assignedTo", "assignedBy", "updatedAt"],
    });
  });
  static teamSummary = catchAsync(async (req, res, _next) => {
    const teams = await prisma.teamMembers.groupBy({
      by: ["assignedTo"],
      _count: true,
    });
    const totalTeams = teams.length;
    const averageTeamSize = Math.floor(
      teams.reduce((acc, curr) => acc + curr._count, 0) / totalTeams
    );
    const teamsWithoutLeader = await prisma.employees.count({
      where: {
        AssignedTo: {
          none: {},
        },
      },
    });

    const data = { totalTeams, teamsWithoutLeader, averageTeamSize };

    response(res, data);
  });
}

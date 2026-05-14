import { ChangeMemberQueueInput, ChangeMemberRoleInput, memberSchemaResponse } from "@repo/schemas";
import z from "zod";
import { APIFeatures } from "../../core/utils/apiFeatures.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { prisma } from "../../core/utils/prismaClient.js";
import response from "../../core/utils/response.js";

export class MemberController {
  static getMembers = catchAsync(async (req, res, _next) => {
    const queueId = req.query.queueId as string;

    const queuefilter = queueId ? { user: { queueAgents: { some: { queueId } } } } : {};
    const { filterOptions, limit, offset } = new APIFeatures(req.query, {
      ignore: ["queueId"],
    })
      .filter()
      .pagination();
    const membership = await prisma.membership.findMany({
      where: {
        organizationId: req.organization.id,
        isSystem: false,
        ...filterOptions.where,
        ...queuefilter,
      },
      select: {
        organizationId: true,
        id: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            avatar: true,
            id: true,
            queueAgents: {
              where: { organizationId: req.organization.id },
              select: {
                ticketCount: true,
                queueId: true,
                queue: {
                  where: { organizationId: req.organization.id },
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });

    const data = membership.map((item) => {
      const user = item.user;

      const totalTickets = user?.queueAgents.reduce((sum, qa) => sum + qa.ticketCount, 0);

      return {
        id: item.id,
        userId: item.user?.id,
        email: user?.email,
        name: user?.name,
        avatar: user?.avatar,
        role: item.role?.name,
        roleId: item.role?.id,
        createdAt: item.createdAt,
        organizationId: item.organizationId,
        totalTickets,
        queues: user?.queueAgents.map((qa) => ({
          queueId: qa.queue?.id,
          name: qa.queue?.name,
          ticketCount: qa.ticketCount,
        })),
      };
    });
    const total = await prisma.membership.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    response(res, data, 200, {
      otherFields: { limit, offset, total },
      schema: z.array(memberSchemaResponse),
    });
  });
  static updateRole = catchAsync(async (req, res, _next) => {
    const { userId, roleId } = req.params as ChangeMemberRoleInput;
    const data = await prisma.membership.update({
      where: {
        organizationId_userId: {
          organizationId: req.organization.id,
          userId,
        },
      },
      data: {
        roleId,
      },
    });
    response(res, data);
  });
  static assignQueue = catchAsync(async (req, res, _next) => {
    const { userId, queueId } = req.params as ChangeMemberQueueInput;
    const data = await prisma.queueAgent.upsert({
      where: {
        queueId_agentId_organizationId: {
          queueId,
          agentId: userId,
          organizationId: req.organization.id,
        },
      },
      update: {},
      create: {
        queueId,
        agentId: userId,
        organizationId: req.organization.id,
      },
    });
    response(res, data);
  });
  static unassignQueue = catchAsync(async (req, res, _next) => {
    const { userId, queueId } = req.params as ChangeMemberQueueInput;
    const data = await prisma.queueAgent.delete({
      where: {
        queueId_agentId_organizationId: {
          queueId,
          agentId: userId,
          organizationId: req.organization.id,
        },
      },
    });
    response(res, data);
  });
}

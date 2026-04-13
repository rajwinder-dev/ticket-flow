/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedQs } from "qs";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { prisma } from "../../core/utils/prismaClient";
import { ActivityLogService } from "./activity.types";

export class ActivityService {
  static lagActivity = async ({
    organizationId,
    actorId,
    actorType,
    entityId,
    entityType,
    event,
    oldData,
    newData,
    severity,
    message,
    metadata,
    ipAddress,
  }: ActivityLogService) => {
    try {
      const changes = oldData && newData ? this.getDiff(oldData, newData) : null;
      return await prisma.activityLog.create({
        data: {
          organizationId,
          actorId,
          actorType,
          entityId,
          entityType,
          event,
          severity,
          changes: changes as any, // Cast for Prisma JSON compatibility
          message,
          metadata,
          ipAddress,
        },
      });
    } catch (error) {
      // Fail silently or log to a secondary service (Sentry/Logtail)
      console.error("Failed to create activity log:", error);
    }
  };

  static getActivityLogs = async (organizationId: string, queryStaring: ParsedQs) => {
    const { limit, offset, filterOptions } = new APIFeatures(queryStaring).pagination().search();
    const total = await prisma.activityLog.count({
      where: {
        organizationId,
        ...filterOptions.where,
      },
    });
    const data = await prisma.activityLog.findMany({
      where: {
        organizationId,
        ...filterOptions.where,
      },
      skip: offset,
      take: limit,
    });
    const pagination = {
      total, offset, limit
    }
    return {data, pagination}
  };
  static getActivitySummary = async (organizationId: string) => {
    const data = await prisma.activityLog.groupBy({
      where: {
        organizationId,
      },
      by: "severity",
      _count: {
        _all: true,
      },
    });
    const total = await prisma.activityLog.count({ where: { organizationId } });
    // Format output to group as { WARN: count, INFO: count, ERROR: count }
    const summary = { warn: 0, info: 0, error: 0 };

    data.forEach((item: any) => {
      if (item.severity === "WARN") summary.warn = item._count._all;
      if (item.severity === "INFO") summary.info = item._count._all;
      if (item.severity === "ERROR") summary.error = item._count._all;
    });

    return { ...summary, total };
  };
  static getDiff = (oldData: any, newData: any) => {
    const diff: Record<string, { from: any; to: any }> = {};

    Object.keys(newData).forEach((key) => {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        diff[key] = {
          from: oldData[key],
          to: newData[key],
        };
      }
    });

    return Object.keys(diff).length > 0 ? diff : null;
  };
}

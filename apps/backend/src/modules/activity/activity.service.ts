/* eslint-disable @typescript-eslint/no-explicit-any */
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

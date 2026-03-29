import { ActorType, EntryType, LogSeverity } from "../../../generated/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ActivityLogService {
  organizationId?: string;
  actorId?: string;
  entityType: EntryType;
  event: string;
  entityId?: string;
  actorType?: ActorType;
  severity?: LogSeverity;
  oldData?: any;
  newData?: any;
  message: string;
  metadata?: any;
  ipAddress?: string;
}
